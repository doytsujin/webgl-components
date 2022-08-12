import { UniformsUtils, IUniform } from 'three';

export type Shader = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uniforms: { [uniform: string]: IUniform<any> };
  vertexShader: string;
  fragmentShader: string;
};

type ShaderProps = {
  [prop: string]: string;
};

export type ShaderConfig = {
  uniforms: {
    [prop: string]: Record<string, unknown>;
  };
  // uniforms: {
  //   [prop: string]: Object;
  // };
  vertexShader: { uniforms: string; functions: string; [prop: string]: string };
  fragmentShader: { uniforms: string; functions: string; [prop: string]: string };
};

const hooks = {
  vertex: {
    preTransform: 'before:#include <begin_vertex>\n',
    postTransform: 'after:#include <project_vertex>\n',
    preNormal: 'before:#include <beginnormal_vertex>\n'
  },
  fragment: {
    outgoingLightColor:
      'after:vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n',
    fragColor: 'after:#include <dithering_fragment>\n'
  }
};

function replace(shader: string, hooks: ShaderProps, config: ShaderProps) {
  Object.keys(hooks).forEach((hook: string) => {
    if (config[hook] != null) {
      const parts = hooks[hook].split(':');
      const line = parts[1];
      switch (parts[0]) {
        case 'after': {
          shader = shader.replace(
            line,
            `${line}
            ${config[hook]}`
          );
          break;
        }
        default: {
          // before
          shader = shader.replace(
            line,
            `${config[hook]}
            ${line}`
          );
          break;
        }
      }
    }
  });
  return shader;
}

/**
 * Modify threejs built in materials
 *
 * @export
 * @param {Shader} shader
 * @param {ShaderConfig} config
 * @return {*}
 */
export default function materialModifier(shader: Shader, config: ShaderConfig) {
  shader.uniforms = UniformsUtils.merge([shader.uniforms, config.uniforms]);

  shader.vertexShader = `
    ${config.vertexShader.uniforms}
    ${config.vertexShader.functions}
    ${shader.vertexShader}
  `;
  shader.fragmentShader = `
    ${config.fragmentShader.uniforms}
    ${config.fragmentShader.functions}
    ${shader.fragmentShader}
  `;

  shader.vertexShader = replace(shader.vertexShader, hooks.vertex, config.vertexShader);
  shader.fragmentShader = replace(shader.fragmentShader, hooks.fragment, config.fragmentShader);

  return shader;
}

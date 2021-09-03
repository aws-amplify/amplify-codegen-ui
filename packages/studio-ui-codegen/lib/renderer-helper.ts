import {
  StudioComponent,
  StudioComponentChild,
  StudioComponentDataPropertyBinding,
  StudioComponentAuthPropertyBinding,
  StudioComponentStoragePropertyBinding,
  StudioComponentEventPropertyBinding,
  StudioComponentSimplePropertyBinding,
  StudioComponentPropertyType,
} from '@amzn/amplify-ui-codegen-schema';

export const StudioRendererConstants = {
  unknownName: 'unknown_component_name',
};

export function isStudioComponentWithBinding(
  component: StudioComponent | StudioComponentChild,
): component is StudioComponent {
  return 'bindingProperties' in component;
}

export function isDataPropertyBinding(
  prop:
    | StudioComponentDataPropertyBinding
    | StudioComponentAuthPropertyBinding
    | StudioComponentStoragePropertyBinding
    | StudioComponentEventPropertyBinding
    | StudioComponentSimplePropertyBinding,
): prop is StudioComponentDataPropertyBinding {
  return 'type' in prop && prop.type === 'Data';
}

export function isAuthPropertyBinding(
  prop:
    | StudioComponentDataPropertyBinding
    | StudioComponentAuthPropertyBinding
    | StudioComponentStoragePropertyBinding
    | StudioComponentEventPropertyBinding
    | StudioComponentSimplePropertyBinding,
): prop is StudioComponentAuthPropertyBinding {
  return 'type' in prop && prop.type === 'Authentication';
}

export function isStoragePropertyBinding(
  prop:
    | StudioComponentDataPropertyBinding
    | StudioComponentAuthPropertyBinding
    | StudioComponentStoragePropertyBinding
    | StudioComponentEventPropertyBinding
    | StudioComponentSimplePropertyBinding,
): prop is StudioComponentStoragePropertyBinding {
  return 'type' in prop && prop.type === 'Storage';
}

export function isSimplePropertyBinding(
  prop:
    | StudioComponentDataPropertyBinding
    | StudioComponentAuthPropertyBinding
    | StudioComponentStoragePropertyBinding
    | StudioComponentEventPropertyBinding
    | StudioComponentSimplePropertyBinding,
): prop is StudioComponentSimplePropertyBinding {
  return (
    'type' in prop &&
    [
      StudioComponentPropertyType.Boolean.toString(),
      StudioComponentPropertyType.Number.toString(),
      StudioComponentPropertyType.String.toString(),
      StudioComponentPropertyType.Date.toString(),
    ].includes(prop.type)
  );
}

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

/**
 * Verify if this is 1) a type that has the collectionProperties, and 2) that the collection
 * properties object is set. Then provide the typehint back to the compiler that this attribute exists.
 */
export function isStudioComponentWithCollectionProperties(
  component: StudioComponent | StudioComponentChild,
): component is StudioComponent & Required<Pick<StudioComponent, 'collectionProperties'>> {
  return 'collectionProperties' in component && component.collectionProperties !== undefined;
}

export function isStudioComponentWithVariants(
  component: StudioComponent | StudioComponentChild,
): component is StudioComponent & Required<Pick<StudioComponent, 'variants'>> {
  return 'variants' in component && component.variants !== undefined && component.variants.length > 0;
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

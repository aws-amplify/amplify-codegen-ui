import { StudioNode, StudioComponent, StudioComponentChild } from '@aws-amplify/codegen-ui';
import { JsxElement, JsxFragment, JsxSelfClosingElement } from 'typescript';
import { ReactStudioTemplateRenderer } from '../react-studio-template-renderer';
import { ReactComponentRenderer } from '../react-component-renderer';
import { ImportSource } from '../imports';
import { 
  createAlert, 
  createBreadcrumbGroup, 
  createButton, 
  createDatePicker, 
  createMasthead, 
  createRowOrColumn, 
  createSearchField, 
  createSelect, 
  createSideMenu, 
  createTag,
  createText 
} from './meridian-component-renderers';

export class AmplifyMeridianRenderer extends ReactStudioTemplateRenderer {
  renderJsx(
    component: StudioComponent | StudioComponentChild,
    parent?: StudioNode,
  ): JsxElement | JsxFragment | JsxSelfClosingElement {
    const node = new StudioNode(component, parent);
    const renderChildren = (children: StudioComponentChild[]) => children.map((child) => this.renderJsx(child, node));

    this.importCollection.addImport('prop-types', 'PropTypes');

    switch (component.componentType) {
      //Pass argument "component" instead of "this.component" in create[Component] functions

      case 'Alert':
        this.importCollection.addImport(ImportSource.MERIDIAN + 'alert', 'Alert');
        return createAlert(component, this.propTypes);

      case 'Breadcrumb':
        this.importCollection.addImport(ImportSource.MERIDIAN + 'breadcrumb', 'Breadcrumb');
        this.importCollection.addImport(ImportSource.MERIDIAN + 'breadcrumb', 'BreadcrumbGroup');
        return createBreadcrumbGroup(component, this.propTypes);

      case 'Button':
        this.importCollection.addImport(ImportSource.MERIDIAN + 'button', 'Button');
        return createButton(component, this.propTypes);

      case 'DatePicker':
        this.importCollection.addImport(ImportSource.MERIDIAN + 'date-picker', 'DatePicker');
        return createDatePicker(component, this.propTypes);

      case "Masthead":
        this.importCollection.addImport(ImportSource.MERIDIAN + 'masthead', 'Masthead');
        this.importCollection.addImport(ImportSource.MERIDIAN + 'masthead', 'MastheadLink');
        return createMasthead(component, this.propTypes);
  
      case 'SearchField':
        this.importCollection.addImport(ImportSource.MERIDIAN + 'search-field', 'SearchField');
        return createSearchField(component, this.propTypes);

      case 'Select':
        this.importCollection.addImport(ImportSource.MERIDIAN + 'select', 'Select');
        return createSelect(component, this.propTypes);
      
      case 'SideMenu':
        this.importCollection.addImport(ImportSource.MERIDIAN + 'side-menu', 'SideMenu');
        this.importCollection.addImport(ImportSource.MERIDIAN + 'side-menu', 'SideMenuLink');
        this.importCollection.addImport(ImportSource.MERIDIAN + 'side-menu', 'SideMenuTitle');
        return createSideMenu(component, this.propTypes);

      case "Tag":
        this.importCollection.addImport(ImportSource.MERIDIAN + "tag", "Tag");
        return createTag(component, this.propTypes);

      case 'Text':
        this.importCollection.addImport(ImportSource.MERIDIAN + 'text', 'Text');
        return createText(component, this.propTypes);

      case 'Row':
      case 'Column':
        this.importCollection.addImport(
          ImportSource.MERIDIAN + component.componentType.toLowerCase(),
          component.componentType,
        );
        return createRowOrColumn(component, this.propTypes, parent?.component, renderChildren);

      default:
        return new ReactComponentRenderer(
          component,
          this.componentMetadata,
          this.importCollection,
          parent,
        ).renderMeridianElement(renderChildren);
    }
  }
}

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'PaginationWebPartStrings';
import Pagination from './components/Pagination';
import { IPaginationProps } from './components/IPaginationProps';
import {sp} from '@pnp/sp/presets/all';
export interface IPaginationWebPartProps {
  description: string;
}

export default class PaginationWebPart extends BaseClientSideWebPart<IPaginationWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then(() => {
   sp.setup({
    spfxContext:this.context as any
   });
    });
  }

  public render(): void {
    const element: React.ReactElement<IPaginationProps> = React.createElement(
      Pagination,
      {
        description: this.properties.description,
       context:this.context,
       siteurl:this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

 
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

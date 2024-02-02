import * as React from 'react';
// import styles from './Pagination.module.scss';
import { IPaginationProps } from './IPaginationProps';
import {sp} from '@pnp/sp/presets/all';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import {Table,Input} from 'antd';

export interface ITableDesignInterfaceState{
  items:any[];
  searchText:string;
  loading:boolean;
}

export default class Pagination extends React.Component<IPaginationProps, ITableDesignInterfaceState> {
  constructor(props:any){
    super(props);
    this.state={
      items:[],
      searchText:"",
      loading:true
    };
  };

  public componentDidMount(): void {
    sp.setup({
      spfxContext:this.props.context as any
    });
    sp.web.lists.getByTitle('Pagination').items.select('Title','ProductPrice','Company','Person/Title').expand('Person').get()
    .then((data)=>{
      const formattedItems=data.map((item)=>{
        return{
          key:item.Id,
          Title:item.Title,
          ProductPrice:item.ProductPrice,
          Company:item.Company,
          Person:item.Person.Title
        };
      });
      this.setState({
        items:formattedItems,loading:false
      });
    })
    .catch((err)=>{
      console.error('Error fetching data ');
      throw err;
    });
  }
  public handleSearch=(event:React.ChangeEvent<HTMLInputElement>)=>{
    const searchText=event.target.value;
    this.setState({searchText});
  }
  public render(): React.ReactElement<IPaginationProps> {
    const {items,searchText,loading}=this.state;
    const columns=[
      {
        title:'Title',
        dataIndex:'Title',
        key:'Title',
        sorter:(a:any,b:any)=>a.Title.localeCompare(b.Title),
      },
      {
        title:'ProductPrice',
        dataIndex:'ProductPrice',
        key:'ProductPrice'
      },
      {
        title:'Company',
        dataIndex:'Company',
        key:'Company'
      },
      {
        title:'Person',
        dataIndex:'Person',
        key:'Person'
      }
    ]
 
    return (
      <>
      <Input.Search
      placeholder='Search here....'
      value={searchText}
      onChange={this.handleSearch}
      style={{marginBottom:16}}
      />
      <Table dataSource={items.filter((item)=>
      item.Title.toLowerCase().includes(searchText)||
      item.Company.toLowerCase().includes(searchText))}
        
      columns={columns}
      loading={loading}
      pagination={{pageSize:3}}
      />
      </>
    
    );
  }
}

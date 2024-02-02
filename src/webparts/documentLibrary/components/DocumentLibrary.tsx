import * as React from 'react';
// import styles from './DocumentLibrary.module.scss';
import { IDocumentLibraryProps } from './IDocumentLibraryProps';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import {sp} from '@pnp/sp/presets/all';


export default class DocumentLibrary extends React.Component<IDocumentLibraryProps, any> {

  constructor(props:any){
    super(props);
    this.state={
      FirstName:'',
      LastName:'',
      HTMLthing:''
    }
    this.handleChange=this.handleChange.bind(this);
    this.resetForm=this.resetForm.bind(this);

  }

  public async componentDidMount() {
    const list = await sp.web.lists.getByTitle("FileUpload"); // or get by title

    // Get the view definition
      const view = await list.getView("8d229a1e-8ef5-47a0-9f85-03496cee17ba")();
      const viewSchema = view.HtmlSchemaXml;
      const { Row: data } = await list.renderListDataAsStream({
        ViewXml: viewSchema
      });
      console.log(data);
      let htmlman:string="";
      for(let i=0;i<=data.length-1;i++){
        htmlman=htmlman+"FileName:"+data[i].FileLeafRef+"FN:"+data[i].FirstName+"LN"+data[i].LastName; 
      }
      this.setState({
        HTMLthing:htmlman
        
      })
      console.log(this.state.HTMLthing);

      
      
      // this.setState({
      //   FileName1:data.FileLeafRef,
      //   FN:data.
      // })
    
  }

  //Regular Upload
  private regularUpload(myfile:File):Promise<void>{
    return sp.web.getFolderByServerRelativeUrl('/sites/dude/FileUpload').files.add(myfile.name,myfile,true)
    .then((f) => {
      console.log("File Uploaded");
      return f.file.getItem().then((item)=>{
        return item.update({
          Title:'Metadata Updated',
          FirstName:this.state.FirstName,
          LastName:this.state.LastName
        })
        .then((myupdate) =>{
          console.log(myupdate);
          console.log('Metadata Update');

        })

      })
      .catch((err) =>{
         console.log('Error Occured');
         throw err;
      });

    });
  }

  //Chuncked Upload

  private chunckedUpdate(myfile:File):Promise<void>{
    return sp.web.getFolderByServerRelativeUrl('/sites/dude/FileUpload').files.
    addChunked(myfile.name,myfile)
    .then(({file}) => file.getItem() )
    .then((item) => {
      return item.update({
        Title:'Metadata Updated',
        FirstName:this.state.FirstName,
        LastName:this.state.LastName
      })
      .then((myupdate) => {
        console.log(myupdate);
        console.log('Metadata Updated');
      })

    })
    .catch((err)=>{
      console.error('Error Occured');
      throw err;

    })


  }



    //Form Event
    private handleChange(event:any){
      const target=event.target;
      const value=target.value;
      const name=target.name;
      this.setState({[name]:value});
    }
    //resetform
    private resetForm(){
      this.setState({
        FirstName:'',
        LastName:''
      });
      const inputFile=document.querySelector('#newfile') as HTMLInputElement|null;
      if(inputFile){
        inputFile.value='';
      }
    }

  //Saving File

  private fileSave = () =>{
    const inputFile=document.querySelector('#newfile') as HTMLInputElement | null;
    if(inputFile && inputFile.files && inputFile.files.length>0){
      const files=inputFile.files;
      const uploadPromises:Promise<void>[]=[];
      for(let i=0;i<files.length;i++){
        const myfile = files[i];
        if(myfile.size<=10485760){
          uploadPromises.push(this.regularUpload(myfile));
        }
        else{
          uploadPromises.push(this.chunckedUpdate(myfile));
        }
      }
      Promise.all(uploadPromises)
      .then(()=>{
        console.log("Files Uploaded");
      })
      .catch((err)=>{
        console.log('Error Occured');
      })
    }


  }



  public render(): React.ReactElement<IDocumentLibraryProps> {


    return (
      <>
      <h1 className='text-center fs-4 text-primary'>INDIAN CITIZENSHIP Form</h1>
   <div className='row'>
    <div className='col'>
      <div className='form-group'>
        <label htmlFor='FirstName' className='form-label fs-6'>First Name</label>
        <input type='text' name='FirstName' id='FirstName' value={this.state.FirstName}
        onChange={this.handleChange} placeholder='First Name' className='form-control'/>
      </div>
    </div>
    <div className='col'>
      <div className='form-group'>
        <label htmlFor='LastName' className='form-label fs-6'>Last Name</label>
        <input type='text' name='LastName' id='LastName' value={this.state.LastName}
        onChange={this.handleChange} placeholder='Last Name' className='form-control'/>
      </div>
    </div>
   </div>
   <div className='form-group'>
    <label htmlFor='myfile' className='form-label fs-6'>Upload Documents</label>
   <input type='file' name='myfile' id='newfile' className='form-control'/>
   </div>
   <br/>
   <button onClick={this.fileSave} className='btn btn-primary' type='submit'>Save Form</button>
   <button onClick={this.resetForm} className='btn btn-secondary ms-2' type='reset'>Reset Form</button>
      </>
    );
  }
}


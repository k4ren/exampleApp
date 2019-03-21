import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public image: string;
  public imgCopy: string;
  public imagenes = [];

  constructor(
    private camera: Camera,
    private webview: WebView,
    private file: File,
    private filePath: FilePath
  ) { }

  openCamera(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
       //Set the source of the picture
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      //Rotate the image to correct for the orientation of the device during capture
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      this.image = this.webview.convertFileSrc(imageData);
    }, (err) => {
     // Handle error
     console.log(err);
    }); 
  }
  createNewFile() {
    console.log('here!'); 
  // https://github.com/ionic-team/ionic-native/issues/657#issuecomment-253084301
    this.file.resolveDirectoryUrl(this.file.cacheDirectory).then((dirEntry) => {
      dirEntry.getFile('example.jpeg', {create: true, exclusive: false}, (fileEntry) => {
        console.log(fileEntry);
      }, (err) => {
        console.log(err);        
      });
    }, (err) => {
      console.log(err);      
    })

  }
 

  ngOnInit() {
    console.log('welcome');
  }

}

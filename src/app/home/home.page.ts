import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public image: any;
  
  constructor(
    private camera: Camera,
    private webview: WebView
  ) { }

  openCamera(){
    const options: CameraOptions = {
      quality: 10,
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

  ngOnInit() {
    console.log('welcome');
  }

}

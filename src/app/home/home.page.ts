import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public image: any
  
  constructor(
    private camera: Camera
  ) { }

  openCamera(){
    console.log('here!');
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
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):

     this.image = imageData;

     console.log(this.image);
    //  let base64Image = 'data:image/jpeg;base64,' + imageData;
    //  console.log(base64Image);
     
    }, (err) => {
     // Handle error
    });
  }

  ngOnInit() {
    console.log('welcome');
  }

}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Storage } from '@ionic/storage';
import { Platform, ActionSheetController, ToastController } from '@ionic/angular';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  // public image: string;
  // public imgCopy: string;
  // public images = [];
  images = [];

  constructor(
    private camera: Camera,
    private webview: WebView,
    private file: File,
    private filePath: FilePath,
    private storage: Storage,
    private ref: ChangeDetectorRef,
    private plt: Platform,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController
  ) { }

  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      console.log('loadstoredimages');      
      if (images) {
        let arr = JSON.parse(images);
        this.images = [];
        for (let img of arr) {
          let filePath = this.file.dataDirectory + img;          
          let resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath: filePath });
          // console.log('load','images[] ' + JSON.stringify(this.images));          
        }
      }
    });
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

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
    this.camera.getPicture(options).then((imagePath) => {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
      console.log(imagePath);      
      // this.image = this.webview.convertFileSrc(imageData);
      // this.getFileEntry(imageData)
    }, (err) => {
     console.log(err);
    }); 
  }

  createFileName() {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
  }
 
  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      console.log('Error while storing file...');      
        // this.presentToast('Error while storing file.');
    });
  }

  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
        let newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath
      };

      this.images = [newEntry, ...this.images];
      console.log(this.images);
      
      this.ref.detectChanges(); // trigger change detection cycle
    });
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }

  deleteImage(imgEntry, position) {
    this.images.splice(position, 1);
    console.log('delete image');
    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      let filtered = arr.filter(name => name != imgEntry.name);
      this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

      var correctPath = imgEntry.filePath.substring(0, imgEntry.filePath.lastIndexOf('/')+1);
      this.file.removeFile(correctPath, imgEntry.name).then(res => {
        this.presentToast('File removed.');
      });
    });
  }

  ngOnInit() {
    this.plt.ready().then(() => {
      this.loadStoredImages();
    });
  }
  
}

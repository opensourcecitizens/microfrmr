
/**
* Handles image display and persistence to/from IPFS
*/
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Button, TextInput } from 'react-native';
import * as DbApi from "../appData/ApiCaller";
import {IPFS_URL} from "../constants";
import { Buffer } from 'buffer';

let ipfsUrl = IPFS_URL;

const  previewWebUrl = (appendToElementId, blobURL)=>{
            //console.log('preview Image appendToElementId='+appendToElementId+',  blobURL='+blobURL);
            const previewHeight = 200;
            const previewWidth = 200;
            //const blobURL = window.URL.createObjectURL(file);
            const img = new Image();
            img.src = blobURL;
            img.onload = function (ev) {
              window.URL.revokeObjectURL(blobURL); // release memory
              const canvas = document.createElement('canvas');
              canvas.width = previewWidth;
              canvas.height = previewHeight;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              document.getElementById(appendToElementId).append(canvas);
            };
 }
/**
This was originally written for websockets but due to
GCP gateways not supporting browser-server websockets
we have decided to use js_streaming to do http/2 interactions
**/
function UploadImage({imageCid, setImageCid}) {

    const [previewImage, setPreviewImage] = useState(null);
    const [compresseddata, setCompressedData] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

    useEffect(()=>{

        if(isUploading){
            setIsUploaded(false);
        }

        if(isUploaded){
            setIsUploading(false);
            setIsSelected(false);
            setPreviewImage(null);
        }

        if(isSelected){
            //setIsUploading(false);
         }

        return (()=>{setIsUploaded(false);setIsUploading(false);setIsSelected(false);})
    },[isUploading, isUploaded, isSelected]);


    const handleUploadImage =  () => {
        console.log('UploadImage ws handleUploadImage');
        console.log('handleUploadImage ipfsAddress = ',`${ipfsUrl}`);
        //setIsUploading(true);
        //setIsUploaded(false);
        const ws  = new WebSocket(ipfsUrl+"/persist");
        ws.onmessage = (event) => {
              console.log('upload ws onmessage: %s', JSON.stringify(event));
              console.log('upload ws onmessage cid: %s', event.data);
              setImageCid(event.data);
              ws.close();
              setIsUploading(false);
              setIsUploaded(true);
         };
         ws.onopen = () => {
              //setIsUploading(true);
              console.log('upload ws onopen:');
              setIsUploading(true);
              setIsUploaded(false);
              //console.log('upload ws onopen:');
              ws.send(previewImage);
        };
        ws.onError = () => {
            console.error('upload ws onerror:');
        };

        ws.onClose = () => {
            console.log('upload ws onclose:');
        };
    }

    const handleSelectImage =  (event) => {

        setIsSelected(false);
        const file = event.target.files[0];
        if(!file)return;

        const fileReader = new FileReader();
        const handleEvent = (fevent) => {
            if(fevent.type==="load"){
                 setPreviewImage(fileReader.result);
                 /*const compressedReadableStream = fileReader.result.pipeThrough(
                   new CompressionStream('gzip')
                 );
                 setCompressedData(compressedReadableStream);
                 */
                 setIsSelected(true);
            }else if(fevent.type==="progress"){
                 console.log("UploadImage progress="+fevent);
            }else if(fevent.type==="error"){
                 console.error(fevent);
                 setIsSelected(false);
            }
        }
        fileReader.addEventListener("load", handleEvent);
        fileReader.addEventListener("error", handleEvent);
        fileReader.addEventListener("progress", handleEvent);
        fileReader.readAsDataURL(file);
    }

    return (
        <View style={styles.container}>
            {
                !isSelected && !isUploading && !isUploaded ? <p> Select image and upload. </p>: null
            }
            {
                isUploading ? <p> Saving image .... </p>: null
            }
            {
                isUploaded ? <p> Uploading complete. Click on update button for changes to commit your changes. </p>: null
            }
            {
               isSelected ?
               <div id="uploadPreview">
                    <Image source={previewImage} alt="preview-image" height="200px"/>

                    <Button onClick={handleUploadImage}>Upload</Button>
                </div> : null
            }
            <TextInput type="file" accept="image/*" onChange={handleSelectImage} />
        </View>
    );

};

function ImageViewer({idxKey, imageCid, url, styles }) {
    const [lIpfsUrl, setLIpfsUrl] = useState(ipfsUrl);
    const imgKey = useState(idxKey);
    const [imageUrl ,setImageUrl ] = useState(null);
    const [imageData, setImageData ] = useState(null);
    const [isUploading, setIsUploading] = useState(true);
    console.log("ImageViewer", "imageCid=",imageCid);
    useEffect(()=>{
       URL.revokeObjectURL(imageUrl);

       if(url!=null){
            console.log("ImageViewer useEffect","url=",url,"lIpfsUrl=",lIpfsUrl);
            setImageUrl(url);
            setIsUploading(false);
            return(()=>{url});
       }else if(imageCid!=null){

            //return((imageCid)=>{
                console.log("ImageViewer useEffect","imageCid=",imageCid,"lIpfsUrl=",lIpfsUrl);
                DbApi.getImagesWebsocket().then((socurl)=>{
                    console.log("ImageViewer getImagesWebsocket","socurl=",socurl);
                    if(socurl){
                        handleRetrieveImage(socurl, imageCid );
                        //return(()=>{imageCid});
                    }
                 });
            //});
       }

       const timeOpt = setTimeout(()=>{
           console.log("ImageViewer setting timeout!");
           if(isUploading==true){
                setImageUrl('/asssets/adaptive-icon.png');
                setIsUploading(false);
                console.warn("ImageViewer timeout!")
           }else{
                console.log("ImageViewer cleared timeout! %s %s %s", imageData, imageUrl, isUploading);
           }
       }, 1000);
       //return (clearTimeout(timeOpt));

        //return(setIsUploading(false));

    },[ imageCid, url]);

    const handleRetrieveImage =  (socurl, imageCid) => {
           if(!imageCid) throw "ImageCiD was null";

            const handleBuffer = async (dat) => {
                let buff = await dat.arrayBuffer();
                //console.log('ImageViewer.handleRetrieveImage.handleBuffer','buff',buff);
                let tmp = await Buffer.from(buff,'binary').toString('base64');
                //let tmp = await Buffer.from(buff,'binary').toString();
                //console.log('Image ws onmessage img tmp: %s', tmp);
                return tmp
            };

           const ws  = new WebSocket(socurl+"/retrieve");

           ws.onmessage = (event) => {
                 console.log('Image ws onmessage ...');
                 //console.log('Image ws onmessage: %s', JSON.stringify(event));
                 //console.log('Image ws onmessage: %s', event.data);
                 if(event.data){
                   handleBuffer(event.data).then((img)=>{
                   //setImageData(img);
                   setImageData(`data:image/jpeg;base64,${img}`);
                   if(img!=null){
                        setIsUploading(false);
                   }else{
                      console.log('Image ws onmessage: img is null');
                   }
                   ws.close();
                   });
                 }
            };
            ws.onopen = () => {
                 setIsUploading(true);
                 console.log('Image ws onopen:');
                 ws.send(imageCid);
           };
           ws.onError = () => {
               console.error('Image ws onerror:');
           };
           ws.onClose = () => {
               console.error('Image ws onclose:');
           };

       }


    return (
        <View id={imgKey} >
            {
                isUploading ? <p>Retrieving image ....</p> : null
            }
            {
               !imageData && imageUrl ?
                    <Image source={imageUrl}  style={styles} />
                        :
                    null
            }
            {
                imageData ?
                    <Image source={{ uri: imageData }} style={styles} />
                        :
                    null
            }
        </View>
    );

}

export {UploadImage, ImageViewer};
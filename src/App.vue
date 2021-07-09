<template>
  <v-app>  
    <v-app-bar
      app      
      flat
    >
      <v-container class="py-0 fill-height">
        <v-app-bar-title class="text-no-wrap">
         <v-icon>mdi-cloud-outline</v-icon> EtherCloud
        </v-app-bar-title>    
        
        <v-spacer></v-spacer>

        <v-btn id="btnConnect" v-if="userWalletConnected" disabled >
          <v-icon>mdi-lock-outline</v-icon> Connect MetaMask 
        </v-btn>
        <v-btn id="btnConnect" outlined color="indigo" @click="getAccount" v-else>
          <v-icon>mdi-lock-outline</v-icon> Connect MetaMask 
        </v-btn>
        
      </v-container>
    </v-app-bar>
    
    <v-main class="lighten-4"
            style="background-color:rgb(59, 154, 227, 0.70);padding-bottom:50px">
     
      <v-container>

        <v-row >
          <v-col offset="2" cols=9>
            <v-sheet
              rounded="lg"
              elevation="24"
              style="font-size: 24px"              
              >   
              <div style="float:left; width:650px; max-width:650px; word-wrap:break-word;" v-if="userPaymentNeeded" >
                <p id="infoText" style="background-color:lightcoral;padding-left:10px;padding-right:10px">
                  Connected Wallet Address: <b>{{userAddress}}</b>
                </p>                
              </div>
              <div class="box" style="float:left; width:600; max-width:600; word-wrap:break-word;" v-else>
                <p id="infoText" style="background-color:mediumaquamarine;padding-left:10px;padding-right-right:10px">
                  Connected Wallet Address: <b>{{userAddress}}</b>
                </p>
              </div></v-sheet>
          </v-col>
        </v-row>

        <v-row>
          <v-col offset="2" cols=6 v-if="userWalletConnected">
            
            <v-sheet
              rounded="lg"
              elevation="24">
              <h2 style="padding-left:5px;background-color:lemonchiffon">
                <v-icon>mdi-calendar-lock</v-icon> Next Payment Date: {{nextPaymentDate}} 
              </h2>
              <p style="padding-left:10px;padding-right:10px;padding-top:5px">
                Each 30 days since the last payment, an Ether payment of <labeL style="color:green">({{nextPaymentAmtEth}} ETH)</labeL> will be required to continue usage
              </p>
              <p style="background-color:yellow">
                *This does not include gas fees*
              </p>
            </v-sheet>
          </v-col> 
        </v-row>

        <v-row>        

          <v-col offset="2" cols="9">              
            <v-card   
            max-width="900"     
            elevation="20"       
            align="center"
            >
              <v-card-title 
                style="background-color:white;color:black"
                >
                <h1>
                  {{fileLoadMethod}}
                </h1>
              </v-card-title>

              <v-file-input
                v-if="userPaymentNeeded" 
                disabled
                @change="onFileSelected"
                class="mt-4"
                style="padding-left:25px;padding-right:25px"
                prepend-icon="mdi-upload"
                placeholder="Press here to select a file to upload"
                dense                
              ></v-file-input>

              <v-file-input
                v-else
                @change="onFileSelected"
                class="mt-4"
                style="padding-left:25px;padding-right:25px"
                prepend-icon="mdi-upload"
                placeholder="Press here to select a file to upload"
                dense                
              ></v-file-input>

              <v-row
                align="center"
                justify="space-around"
                class="mb-3 mt-1"
                >

                <v-card-actions v-if="userPaymentNeeded">       
                  <v-btn disabled @click="onSaveFile">Upload File</v-btn>
                </v-card-actions>

                <v-card-actions v-else>
                  <v-btn @click="onSaveFile">Upload File</v-btn>
                </v-card-actions>

              </v-row>

              <v-divider></v-divider>

              <div v-if="userPaymentNeeded">

              </div>
              <div v-else>
                <v-card height="200" v-if="isLoading">
                  <v-layout align-center justify-center column fill-height>
                    <v-progress-circular 
                    
                    :size="70"
                    :width="7"
                    color="blue"
                    indeterminate                  
                  ></v-progress-circular>
                  </v-layout>
                </v-card>              
                <v-list dense v-else>
                  <v-list-item-group>
                    <v-list-item                    
                      v-for="file in fileRows"
                      :key="file.fileId"
                    >
                      <v-list-item-avatar 
                        @click="onDownloadFile(file.fileId)"> 
                        <v-icon>{{file.fileCategory}}</v-icon>
                      </v-list-item-avatar>

                      <v-list-item-content 
                        @click="onDownloadFile(file.fileId)"
                      >
                        <v-list-item-title v-text="file.name"></v-list-item-title>

                        <v-list-item-subtitle v-text="file.fileSize"></v-list-item-subtitle>
                        <v-list-item-subtitle v-text="file.date">
                          
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      
                      <v-list-item-action>
                        <v-row>                        
                          <v-btn icon>
                              <v-icon @click="onDeleteFile(file.fileId)" color="grey lighten-1">mdi-delete</v-icon>
                          </v-btn>
                        </v-row>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list-item-group>
                  <v-divider></v-divider> 
                </v-list>
              </div>
            </v-card>         
          </v-col>
        </v-row>  
      </v-container>
    </v-main>

    <v-bottom-navigation    
      class="mt-2"
      fixed      
      color="primary"   
      horizontal  
      grow
      >

    <v-btn v-if="userPaymentNeeded" disabled>
        <span>
          Documents
        </span>
        <v-icon>
           mdi-file
        </v-icon>
      </v-btn>
      <v-btn @click="loadAllDocuments" v-else>
        <span>
          Documents
        </span>
        <v-icon>
          mdi-file
        </v-icon>
      </v-btn>      

      <v-btn v-if="userPaymentNeeded" disabled>
        <span>
          Images
        </span>
        <v-icon>
          mdi-file-image
        </v-icon>
      </v-btn>
      <v-btn @click="loadAllPhotos" v-else>
        <span>
          Images
        </span>
        <v-icon>
          mdi-file-image
        </v-icon>
      </v-btn>

       <v-btn v-if="userPaymentNeeded" disabled>
        <span>
          All Files
        </span>
        <v-icon>
          mdi-file-multiple
        </v-icon>
      </v-btn>
      <v-btn @click="loadAllFiles" v-else>
        <span>
          All Files
        </span>
        <v-icon>
          mdi-file-multiple
        </v-icon>
      </v-btn>

      <v-btn v-if="userPaymentNeeded" disabled>
        <span>
          Audio
        </span>
        <v-icon>
          mdi-file-music
        </v-icon>
      </v-btn>
      <v-btn @click="loadAllAudio" v-else>
        <span>
          Audio
        </span>
        <v-icon>
          mdi-file-music
        </v-icon>
      </v-btn>

      <v-btn v-if="userPaymentNeeded" disabled>
        <span>
          Videos
        </span>
        <v-icon>
          mdi-file-video
        </v-icon>
      </v-btn>
      <v-btn @click="loadAllVideos" v-else>
        <span>
          Video
        </span>
        <v-icon>
          mdi-file-video
        </v-icon>
      </v-btn>
      
    </v-bottom-navigation>    
  </v-app>
</template>

<script>
import axios from 'axios';
import Web3 from 'web3';
const web3 = new Web3;
//const web3 = new Web3(window.web3.currentProvider); 
const bzz = web3.bzz;


export default {
  name: 'App',

  methods:
  {
    scrollToTop: async function(){

    },

    logger: async function(logType, logMessage){

      var request = {UserAddress: this.userAddress, LogType: logType, LogMessage: logMessage}

      try{
        axios({
            method: 'post',
            url: 'http://localhost:3000/Logging',
            data: request
          });      
      }

      catch(exception)
      {
        console.log(exception);
      }

    },

    url: function(){
      return URL.createObjectURL(this.selectedFile);
    },

    onDeleteFile: async function(e) {

      try{
        var accounts = await web3.eth.getAccounts();
        var requestAccount = accounts[0];

        var request = {address: requestAccount, fileId: e}
          
          axios({
            method: 'post',
            url: 'http://localhost:3000/DeleteFile',
            data: request,
            headers: {
                  'Authorization': this.jwtToken,
                }
          })
          .then(this.loadGrid());      
      }

      catch(exception){
        console.log("onDeleteFile() Exception | " + exception);
        this.Logger("Error", "onDeleteFile() method: " + exception.message);
      }

    },
    
    onDownloadFile: async function(e) {

      console.log("Pressed download");
      try
      {
        this.isLoading = true;
        
        console.log("requestedAccount: " + this.userAddress);

        var hashRequest = "";
        const counter = this.fileRows.length - 1;

        for (var x = 0; x <= counter; x++)
        {
          if (this.fileRows[x].fileId === e)
          {
            hashRequest = this.fileRows[x].hash;
            break;         
          }
        } 
        console.log("hashrequest: " + hashRequest);

        if (hashRequest)
        {
          var encryptionData = await this.get(hashRequest);
          var request = {address: this.userAddress, fileId: e, EncryptedData: encryptionData}
         
         console.log("FileDownload request...")
          var fileDetailsResponse = await axios({
              method: 'post',
              url: 'http://localhost:3000/fileDownload',
              data: request,
              headers: {
                  'Authorization': this.jwtToken,
                }
            })
            
          if (fileDetailsResponse)             
          {
            var respFileName = await this.getFileName(fileDetailsResponse.data.FileNameHash);
            var download = document.createElement("a");            
            download.href = fileDetailsResponse.data.FileContent;
            download.download = respFileName;
            download.click();
          }

        }
        else{
         // console.log("Error downloading file");
        }

        this.isLoading = false;
      }

      catch(exception)
      {
        console.log("onDownloadFile() error: " + exception);
        this.isLoading = false;
        window.location.href = "http://localhost:8080/";
        this.Logger("Error", "onDownloadfile() method: " + exception.message);
        
      }
    },

    onFileSelected: async function(e) {
      if (e)
      {
        this.selectedFile = e;
        var reader = new FileReader();    
        reader.onload = () => 
        {
          console.log("filename: " + e.name);
          this.jsonObjRequest = {USER_ADDRESS: this.userAddress , FILE_NAME: e.name
          , FILE_SIZE: e.size, FILE_TYPE: e.type, FILE_BUFFER: reader.result, FILE_NAME_HASH: ""};
          console.log("jsonObjRequest=> ", this.jsonObjRequest);
        }; 
        console.log("Previous jsonObjRequest value: " + this.jsonObjRequest);
        
        if (e) 
        {
          console.log("file selected!");
          console.log(e.name);
          reader.readAsDataURL(e);
        }
      }
    },  

    putFileName: async function(fileName){

      try
      {
         var resphash = await web3.bzz.upload(fileName.FILE_NAME);
         return resphash;
      }

      catch(exception)
      {
        console.log("Error: " + exception);
        this.Logger("Error", "putFileName() method: " + exception.message);
      }

    },

    put: async function(data) {
      
      try 
      {      
        var resphash = await web3.bzz.upload(Buffer.from(data.EncryptedData));      
        var request = {USER_ADDRESS: data.USER_ADDRESS, FILE_ID: data.FILE_ID, HASH: resphash}      
        console.log("Uploaded to swarm: " + resphash);
        var response = await axios({
                  method: 'post',
                  url: 'http://localhost:3000/updateFileHash',
                  data: {
                    uploadReq: request
                  },
                  headers: {
                      'Authorization': this.jwtToken,
                    }
            });

        if (response)
        {
          switch(this.fileLoadMethod)
          {
            case "All Files":
              this.loadGrid();
              break;

            case "loadRecent":
              this.loadRecent();
              break;

            case "Recent Files":
              this.loadAllPhotos();
              break;
          }
        }    
        
        console.log("Update Requests: " + request.HASH + "    |   " + request.FILE_ID);
        
        if (resphash)
        {
          console.log("DATA: " + resphash);
        }

        if (response) {
          console.log("Updating file hash complete for : " + resphash);
        }
      }
      catch (exception) 
      {
        console.log("Error: " + exception);
        this.Logger("Error", "put() method: " + exception.message);
      } 
    },

    getFileName: async function(hash)
    {
      //console.log("getFileName() method :): " + hash);
      try 
      {
        var bytes = await bzz.download(hash);
        var response = Buffer.from(bytes);
        
        if (response)
        {
          console.log("Downloaded filename: (response)" + response);
          return response;
        }

        else
        {
          console.log("error retriving filename696969 from bzz!!!");
        }

      }
      catch (exception) 
      {
        console.log("Error: " + exception);
        this.Logger("Error", "get() method: " + exception.message);
      }
    },

    get: async function(hash) {
      console.log("get() method :)...");
      try 
      {
        var bytes = await bzz.download(hash);
        var response = Buffer.from(bytes);
        
        if (response)
        {
          console.log("Downloaded file: (response)" + response);
          return response;
        }

        else
        {
          console.log("error retriving data from bzz!!!");
        }

      }
      catch (exception) 
      {
        console.log("Error: " + exception);
        this.Logger("Error", "get() method: " + exception.message);
      }
    },
  
    //Handle the file after the save button is pressed
    onSaveFile: async function()
    {  
      console.log("Sending json: " + this.jsonObjRequest); 
    
      if (this.jsonObjRequest) 
      {
        try
        {  
          this.isLoading = true;
          
          var fileNameHash = await this.putFileName(this.jsonObjRequest);
          console.log("FilenameHash: " + fileNameHash);
          if (fileNameHash)
          {
            this.jsonObjRequest.FILE_NAME_HASH = fileNameHash;
            console.log("Check: " + this.jsonObjRequest.FILE_NAME_HASH);
            //var response = await axios.post('http://localhost:3000/fileupload', this.jsonObjRequest);
            var response = await axios({
              method: 'post',
              url: 'http://localhost:3000/fileupload',
              data: {
                uploadReq: this.jsonObjRequest
              },
              headers: {
                  'Authorization': this.jwtToken,
                }
            });
            
            if (response)
            {
              console.log("Here: " + response.data);
              this.put(response.data)
            }
          }
        }
        catch(exception)
        {
          this.Logger("Error", "onSaveFile() method: " + exception.message);
        }
      }
      else
      {
        alert("Please select a File to Upload");
      }
    },  

    setupGrid: async function(response){

      try
      {
        var counter = 0;
        //console.log("SetupGrid begins");
        this.fileRows = [];
        console.log(response.data);
        for(var item in response.data)
        {
            let category = "";
            //console.log(":) FileType: " +  response.data[item].FILE_CATEGORY);
            switch(response.data[item].FILE_CATEGORY)
            {
              case 'D':
                category = "mdi-file";
                //console.log("Document icon...");
                break;

              case 'V':
                category = "mdi-file-video";
                //console.log("Video icon...");
                break;

              case 'I':
                category = "mdi-file-image";
                //console.log("Image icon...");
                break;
              
              case 'A':
                category = "mdi-music-box";
                //console.log("audio file icon...");
                break;

              default:
                  category = "mdi-file"; 
                  //console.log("Default icon...");
                break;
            }      

            var dateObj = new Date(response.data[item].ADD_TIMESTAMP);
            var formattedDate = dateObj.getMonth() + '-' + dateObj.getDate() + '-' + dateObj.getFullYear();
            //console.log("DateString: " + formattedDate);
            console.log("HashString: " + response.data[item].HASH) ;
            var fileName = await this.getFileName(response.data[item].NAME_HASH);
            
            if (fileName) 
            {
              this.fileRows.push({
                //name: response.data[item].FILE_NAME,
                name: fileName,
                fileType: response.data[item].FILE_TYPE,        
                fileId: response.data[item].FILE_ID,
                hash: response.data[item].HASH,
                fileCategory: category,
                date: "Upload Date: " + formattedDate,
              });
            }
            counter++;
        }

        this.totalFiles = counter;
        this.isLoading = false;  
        
      }
      catch(exception)
      {
        this.Logger("Error", "setupGrid() method: " + exception.message);
      }
    },

    deleteData: async function(){

        var accounts = await web3.eth.getAccounts();

            axios({
              method: 'post',
              url: 'http://localhost:3000/deleteFiles',
              data: {
                userAddress: accounts[0]
              },
              headers: {
                  'Authorization': this.jwtToken,
                }
            }).then(x => console.log("Return object :) =>" + x))
          .catch(exception => this.logger("Error", "deleteData() method: " + exception.message));
    },

    loadAllDocuments: async function() {
      console.log("loadAllDocuments hit...");
        try
        {
            this.activeNavBtn = 0;
            this.fileRows.length = 0;            
            this.fileLoadMethod = "Documents";
            this.isLoading = true;
            
            console.log("Loading begins...");
            axios({
              method: 'post',
              url: 'http://localhost:3000/retrieveAllDocuments',
              data: {
                userAddress: this.userAddress
              },
              headers: {
                  'Authorization': this.jwtToken,
                }
            }).then(x => this.setupGrid(x))
                .catch(x => console.log("Error loading grid..." + x));

            console.log("User success login!");
          }
          catch(exception)
          {
            console.log("error msg: " + exception);
            this.Logger("Error", "loadAllDocuments() method: " + exception.message);
          }
    },

    loadAllAudio: async function() {
      console.log("loadAllAudio hit...");
        try
        {
            this.fileRows.length = 0;            
            this.fileLoadMethod = "Audio";
            this.isLoading = true;

            axios({
              method: 'post',
              url: 'http://localhost:3000/retrieveAllAudio',
              data: {
                userAddress: this.userAddress
              },
              headers: {
                  'Authorization': this.jwtToken,
                }
            }).then(x => this.setupGrid(x))
                .catch(x => console.log("Error loading grid..." + x));

            console.log("User success login!");
          }
          catch(exception)
          {
            console.log("error msg: " + exception);
            this.Logger("Error", "loadAllAudio() method: " + exception.message);
          }
    },

    loadAllVideos: async function() {
      console.log("loadAllVideos hit...");
        try
        {
            //Clears filerows
            this.fileRows.length = 0;
            
            //Sets fileLoadMethod
            this.fileLoadMethod = "Videos";

            this.isLoading = true;
            console.log("Loading begins...");
            axios({
              method: 'post',
              url: 'http://localhost:3000/retrieveAllVideos',
              data: {
                userAddress: this.userAddress
              },
              headers: {
                  'Authorization': this.jwtToken,
                }
            }).then(x => this.setupGrid(x))
                .catch(x => console.log("Error loading grid..." + x));

            console.log("User success login!");
          }
          catch(exception)
          {
            console.log("error msg: " + exception);
            this.Logger("Error", "loadAllVideos() method: " + exception.message);
          }
    },

    loadAllPhotos: async function(){
      console.log("LoadAllPhotos hit...");
        try
        {
            //Clears filerows
            this.fileRows.length = 0;
            
            //Sets fileLoadMethod
            this.fileLoadMethod = "Images";

            this.isLoading = true;
            console.log("Loading begins...");
            axios({
              method: 'post',
              url: 'http://localhost:3000/retrieveAllPhotos',
              data: {
                userAddress: this.userAddress
              },
              headers: {
                  'Authorization': this.jwtToken,
                }
            }).then(x => this.setupGrid(x))
                .catch(x => console.log("Error loading grid..." + x));

            console.log("User success login!");
          }
          catch(exception)
          {
            console.log("error msg: " + exception);
            this.Logger("Error", "loadAllPhotos() method: " + exception.message);
          }
    },

    loadRecent: async function(){
      try{
            //Clears filerows
            this.fileRows.length = 0;
            
            //Sets fileLoadMethod
            this.fileLoadMethod = "Recent Files";

            console.log("LoadRecent hit...");

            this.isLoading = true;
            console.log("Loading begins...");
            axios({
              method: 'post',
              url: 'http://localhost:3000/retrieveRecent',
              data: {
                userAddress: this.userAddress
              },
              headers: {
                  'Authorization': this.jwtToken,
                }
            }).then(x => this.setupGrid(x))
                .catch(x => console.log("Error loading grid..." + x));

            console.log("User success login!");
          }
          catch(exception){
          console.log("error msg: " + exception);
          this.Logger("Error", "loadRecent() method: " + exception.message);
          }
    }, 

    makePayment: async function(paymentAmt, isInitialPayment) {
      
      try
      {
       console.log("Received paymentAmt: " + paymentAmt);
        var abi = [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "paymentTimestamp",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "success",
              "type": "bool"
            }
          ],
          "name": "PaymentResult",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "AdminAddress",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "MakeMonthlyPayment",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "PaySetupFee",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ]
        var smartContractAddress = "0x9EeD4CA0c5dF714D823077C9FaE187b6F02E3F96";
        var smartContract = new web3.eth.Contract(abi, smartContractAddress);

        this.isLoading = true;
        
        var paymentResponse = null;
        console.log("Initial? " + isInitialPayment);
        console.log("PaymentAmt? " + paymentAmt);
        if (isInitialPayment)
        {
          console.log("Paysetupfee()");
          paymentResponse =
            await smartContract.methods.PaySetupFee().send({
                from: this.userAddress,
                value: Number(paymentAmt),
              })
              .catch(exception => 
              {
                if (exception.message.includes("denied transaction"))
                {
                  this.userWalletConnected = false;
                  var infoText = document.getElementById("infoText");
                  if (isInitialPayment)
                    infoText.innerText = "A fee of " + this.nextPaymentAmtEth + " is required to start storing files." ;
                  
                  else
                    infoText.innerText = "A fee of " + this.nextPaymentAmtEth + " is required to continue use." ;

                }
              });
        }

        else
        {
          console.log("MakeMonthlyPayment");
          paymentResponse =
            await smartContract.methods.MakeMonthlyPayment().send({
                from: this.userAddress,
                value: Number(paymentAmt),
              })
              .catch(exception => 
              {
                if (exception.message.includes("denied transaction"))
                {
                  this.userWalletConnected = false;
                  var infoText = document.getElementById("infoText");
                  infoText.innerText = "A fee of " + this.nextPaymentAmtEth + " is required for Address " + this.userAddress;
                }
              });
        }        

        if (paymentResponse)
        {
          await smartContract.getPastEvents("PaymentResult", {
            filter: {address : this.userAddress},
          })
          .then(events => {
            let epochTime; 
            let paymentAddress;
            let success;

            for (let item of events)
            {
              epochTime = item.returnValues.paymentTimestamp;
              paymentAddress = item.returnValues.userAddress;
              success = item.returnValues.success;            
            }
            
            if (success)
            {
              console.log("Paymede request pending: ")
              axios({
                method: 'post',
                url: 'http://localhost:3000/PaymentMade',
                data: {
                  userAddress: paymentAddress, 
                  epochTime: epochTime,                  
                  },
                  headers: {
                  'Authorization': this.jwtToken,
                }
                }).then(response => 
                {
                  if (response)
                  {
                    console.log("Received NEW nextpaydate: " + response.data);
                    this.nextPaymentDate = response.data;
                  }
                  this.logger(this.userAddress, "Payment made for " + paymentAmt + " Eth");
                });
            }

            else{
              console.log("An error occurred while making payment")
            }
          }); 
          console.log(paymentResponse);

          console.log("Done with payment process");
          this.userPaymentNeeded = false;  
          this.isLoading = false;
        }

        else
        {
          console.log("An error has occurred with the payment process... please try again later...");
          this.isLoading = false;
        }        
      }

      catch(exception)
      {
        if (exception.includes("denied transaction"))
        {

          let infoText = document.getElementById("infoText");
          infoText.innerText = "A fee of " + this.nextPaymentAmtEth + " is required to use with the Account: " + this.userAddress;
        }
        console.log("Error in the makePayment method..." + exception.message);
        this.logger("Error", "MakePayment() method: " + exception.message);

      }
    },

    loadAllFiles: async function() {
      console.log("loadAllFiles hit...");
        try
        {
            //Clears filerows
            this.fileRows.length = 0;
            
            //Sets fileLoadMethod
            this.fileLoadMethod = "All Files";

            this.isLoading = true;
            console.log("Loading begins...");
            axios({
              method: 'post',
              url: 'http://localhost:3000/retrieveAll',
              data: {
                userAddress: this.userAddress
              },
              headers: {
                  'Authorization': this.jwtToken,
                }
            }).then(x => this.setupGrid(x))
                .catch(x => console.log("Error loading grid..." + x));

            console.log("User success login!");
          }
          catch(exception)
          {
            console.log("error msg: " + exception);
            this.Logger("Error", "loadAllFiles() method: " + exception.message);
          }
    },

    loadGrid: async function() {
      try{
          //Clears filerows
          this.fileRows.length = 0;

          //API Call Begin
          this.isLoading = true;
          console.log("Loading begins...");

          var url = 'http://localhost:3000/';
          switch(this.fileLoadMethod)
          {
             case "All Files":
               url = url + 'retrieveAll';
               break;

             case "Photos":
               url = url + 'retrieveAllPhotos';
               break;
               
             case "Audio":
               url = url + 'retrieveAllAudio';
               break;

             case "Videos":
               url = url + 'retrieveAllVideos';
               break;

             case "Documents":
               url = url + 'retrieveAllDocuments';
               break;
          }

          axios({
            method: 'post',
            url: url,
            data: {
              userAddress: this.userAddress
              ,fileLoadMethod: this.fileLoadMethod 
            },
            headers: {
                  'Authorization': this.jwtToken,
                }
          }).then(x => this.setupGrid(x));
         //     .catch(x => console.log("Error loading grid..." + x));
        }
        catch(exception)
        {
          console.log("error msg: " + "loadGrid() method: " + exception);
          this.Logger("Error", "LoadGrid() method: " + exception.message);
        }
    },

    getAccount: async function () {

      try
      {       
        this.initialSetup();
      }
      catch(exception) 
      {
        console.log(exception);
      }
    },

    initialSetup: async function () {     

      if (window.ethereum)
      {
        console.log('ethereum detected');
        try
        {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          var accounts = await web3.eth.getAccounts();

          this.userAddress = accounts[0];
          //this.userWalletConnected = true;

          console.log("Signing begins..." + this.userAddress);

          //Retrieve/Sign Nonce 
          let signature;
          let nonce;
          let hash;
          let msg;

          await axios({
            method: 'post',
            url: 'http://localhost:3000/HandleUserAuthentication', 
            data: {
              address: this.userAddress,
              type: "initializeNonce"
            }
          }).then(response => {            
            console.log("Returned nonce value: " + response.data.nonce);
            nonce = response.data.nonce;                  
          });

          //Create Signature
          if (nonce)
          {
            msg = nonce.toString();
            hash = web3.utils.sha3(msg);
            var infoText = document.getElementById("infoText");

            signature = await web3.eth.sign(hash, this.userAddress, (err, res) => {
              if (err)
              {               
                infoText.innerText = "To verify your Address, please Sign the Signature Request";
              }
              if (res)
              {
                this.userWalletConnected = true;
                infoText.innerText = "Connected Wallet Address: " + this.userAddress;
              }
            });
          }
          
          //Verify Nonce results
          if (signature)
          {
            await axios({
              method: 'post',
              url: 'http://localhost:3000/HandleUserAuthentication', 
              data: {
                address: this.userAddress,
                type: "processSignedNonce",
                sigReq: signature,
                nonce: nonce,
                hash: hash,
                msg: msg,
              }
            }).then(response => {
              console.log("Setting JWT Token: " + response.data.jwtToken);
              this.jwtToken = response.data.jwtToken;
            });
          }

          if (this.jwtToken)
          {
            console.log("Checking user's payment status now... " + this.jwtToken);
            await axios({
                method: 'post',
                url: 'http://localhost:3000/HandlePayment',
                data: {
                  address: this.userAddress,
                  type: "paymentProccess"
                },
                headers: {
                  'Authorization': this.jwtToken,
                }
              }).then(response => 
              {
                console.log("Authentication Response: " + response.data.DoesUserOwePayment);
                this.nextPaymentDate = response.data.NextPayDate;
                this.nextPaymentAmtEth = response.data.ChargeAmtEth;
                console.log("ChargeAmtWei: "+ response.data.ChargeAmtWei);
                if (response.data.DoesUserOwePayment === true)
                { 
                  console.log("User does owe cash");           
                  console.log("nextPaymentDate: " + response.data.NextPayDate);
                  //console.log("ChargeAmt: " + response.data.ChargeAmtWei);
                  this.userPaymentNeeded = true;
                  this.makePayment(response.data.ChargeAmtWei, response.data.initialPayment);
                  this.loadGrid();  
                }
                if (response.data.DoesUserOwePayment === false)
                {
                  console.log("User does not owe cash");
                  this.userPaymentNeeded = false;
                  this.loadGrid();
                }
              }).catch(exception => console.log(exception));      
          } 
        }
        catch(exception)
        {
          console.log("error msg: " + exception);
          this.Logger("Error", "initialSetup() method: " + exception.message);
        }
      }

      else if (window.web3)
      {
        alert('legacy dapp browser detected');
        window.web3 = new Web3(web3.currentProvider);
      }

      else
      {
        //confirm('non eth-browser detected; need to download metamask');
      }
    },  
  },

  mounted () {
    
    if (window.ethereum) 
    {
      window.ethereum.on('accountsChanged', function()
      { 
        window.location.reload();
      });
    }

    if (typeof window.ethereum !== "undefined")
    {
      web3.eth.setProvider(window.web3.currentProvider);
      web3.bzz.setProvider("https://swarm-gateways.net");      
    }
    else
    {
      //Set the information text
      var infoText = document.getElementById("infoText");
      infoText.innerText = "Please download Metamask to use EtherCloud";

      //Set click event to redirect to metamask login
      var connectBtn = document.getElementById("btnConnect");
      connectBtn.innerText = "Download MetaMask"
      connectBtn.removeEventListener('click', this.getAccount());
      connectBtn.addEventListener('click', function(){
        window.location.href = "https://metamask.io/";
      });      
    }
  },

  data: () => ({
    dialog: false,
    userAddress: "Please connect to MetaMask to begin storing files",
    totalFiles: 0,
    selectedFile: null,
    jsonObjRequest: null,
    accounts: null,
    imageSrc: null,
    fileLoadMethod: "All Files",
    userPaymentNeeded: true,
    isLoading: true,
    nextPaymentDate: "?????????",
    nextPaymentAmtEth: "???",
    userWalletConnected: false,
    activeNavBtn:2,
    jwtToken: null,

    dtoModels:[
      {
        fileName: "",
        fileAddDate: "",
        fileCID: ""
      }
    ],

    fileRows: [],
    filesTableHeaders: [{
      text: "Name",
      align: "start",
      sortable: true,
      value: "name"
    },
      {text: "FileSize", value:"fileSize"},
      {text: "FileType", value:"fileType"},
      {text: "Date Added", value: "date"},
      {text: "Actions", value:"", sortable: false}

    ],   
  }),
};
</script>
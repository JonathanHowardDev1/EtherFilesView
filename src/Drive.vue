<template>
  <v-app>
     <v-main>
         <v-row> 
             <v-col cols=3>
                <input type="file" id="file" name="file" @change="onFileSelected"> 
             </v-col>            
             <v-col cols=9>                
                <v-data-table
                    :headers="filesTableHeaders"
                    :items="fileRows"
                    :items-per-page="8"
                    class="elevation-1"
                >                 
                </v-data-table>                
             </v-col>
         </v-row>
     </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import Web3 from 'web3';
const web3 = new Web3(window.web3.currentProvider); 

export default {


methods: {
    onFileSelected: async function(e) {
        //Serialize file to Base64 format  
        console.log(e);
        if (e){
        this.selectedFile = e;
        var reader = new FileReader();    
        reader.onload = () => {
            var accounts = web3.eth.getAccounts().result;
            this.jsonObjRequest = {userAddress: accounts[0], fileName: "Testfilename", fileContent: reader.result};
            console.log("jsonObjRequest=> ", this.jsonObjRequest);
        }; 

        console.log("Previous jsonObjRequest value: " + this.jsonObjRequest);
        
            if (e) {
                console.log("file selected!");
                reader.readAsDataURL(e.target.files[0]);
            }
        }
    },    

    created: async function () {
      
      if (window.ethereum) {
        alert('ethereum detected');
        window.web3 = new Web3(window.ethereum);
        try{
          await window.ethereum.enable();
          var accounts = await web3.eth.getAccounts();
          this.userAddress = accounts[0];

          //API Call Begin

          console.log("Loading begins...");
          axios({
            method: 'post',
            url: 'http://localhost:3000/loadgrid',
            data: {
              userAddress: accounts[0]
            },
          }).then(x => console.log("Return object :) =>" + x))
        .catch(console.log("Error loading grid..."));
        //API Call End

          console.log("User success login!");
        }
        catch(e){
          console.log("error msg: " + e);
         // console.log('user denied access');
        }
      }

      else if (window.web3){
        alert('legacy dapp browser detected');
        window.web3 = new Web3(web3.currentProvider);
       }

      else{
        alert('non eth-browser detected; need to download metamask')
      
     }
    },  
    }
}
</script>
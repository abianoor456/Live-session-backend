//import axios from "axios";
var app = new Vue({
    el: '#app',
    data: {

        url: '/api/v1/room/',
        password: '',
        name:''
    },
    methods: {

        async getRoom() {
            try {
                console.log(this.password);
                let tempurl = this.url + this.password;
                console.log(tempurl);
                let response = await fetch(tempurl, {
                    method: 'get',
                    headers: new Headers({
                        'Service': 'twilio',
                        'Content-Type': 'application/json'
                    }),
                });
                response = await response.json();
                console.log(response);
            } catch (err) {
                console.log(err)
            }
        },

        async createRoom() {
            try {
                console.log(this.name);
                let tempurl = this.url + this.name;
                console.log(tempurl);
                let response = await fetch(tempurl, {
                    method: 'post',
                    headers: new Headers({
                        'Service': 'twilio',
                        'Content-Type': 'application/json'
                    }),
                });
                response = await response.json();
                console.log(response);
            } catch (err) {
                console.log(err)
            }
        }


    },
    async created() {
        console.log('created')

    }
})



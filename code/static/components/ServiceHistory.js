export default{
    template: `
    <div>
        <h2 class="text-center" style="color: white;">Service History</h2>

        <div class="card text-center" style="width: 77rem;">
            <div class="card-header">
                <div class="container text-center">
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5">
                        <div class="col">ID</div>
                        <div class="col">Service Name</div>
                        <div class="col">Date Of Request</div>
                        <div class="col">Status</div>
                        <div class="col">Action</div>
                    </div>
                </div>
            </div
        </div>
        <div class="card text-center" style="width: 77rem;">
            <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="(service_request,index) in allServiceRequests">
                    <div class="container text-center">
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5">
                            <div class="col">{{service_request.id}}</div>
                            <div class="col" v-for="(service,index) in allServices" v-if="service.id==service_request.service_id">{{service.name}}</div>
                            <div class="col">{{service_request.date_of_request}}</div>
                            <div class="col">{{service_request.service_status}}</div>
                            <div class="col">
                                <button class="btn btn-danger" v-if="service_request.service_status!='closed'" @click="close(service_request.id)">Close Request</button>
                                <button class="btn btn-warning" v-if="service_request.service_status=='closed'" @click="edit(service_request.id)">Edit Request</button>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    `,
    data() {
        return {
            allServiceRequests: [],
            allServices: [],
            error: null,
            customer: {
                "user_id":null
            }
        }
    },
    methods: {
        async close(id) {
            localStorage.setItem("service_request_id", id)
            localStorage.setItem("reload", 0)
            this.$router.push({path: `/service-remarks`})
        },
        async edit(id) {
            localStorage.setItem("service_request_id", id)
            localStorage.setItem("reload", 0)
            this.$router.push({path: `/update-service-remarks`})
        }
    },
    async mounted() {
        this.customer.user_id = localStorage.getItem('user_id')
        const res = await fetch('/api/service-request/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.customer)
        })
        const data = await res.json()
        if(res.ok){
            this.allServiceRequests = data.service_requests,
            this.allServices = data.services
        }
    }
}
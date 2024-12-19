export default {
    template: `
    <div>
        <h2 class="text-center" style=" padding: 10px; color: white; border-radius: 5px;">Professionals</h2>
        <div class="card text-center" style="width: 77rem;">
            <div class="card-header">
                <div class="container text-center">
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5">
                        <div class="col">ID</div>
                        <div class="col">Name</div>
                        <div class="col">Experience (Years)</div>
                        <div class="col">Service</div>
                        <div class="col">Action</div>
                    </div>
                </div>
            </div
        </div>
        <div class="card text-center" style="width: 77rem;">
            <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="(professional,index) in allProfessionals">
                    <div class="container text-center">
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5">
                            <div class="col">{{professional.id}}</div>
                            <div class="col">{{professional.full_name}}</div>
                            <div class="col">{{professional.experience}}</div>
                            <div class="col">{{professional.service}}</div>
                            <div class="col">
                                <button class="btn btn-warning" v-if="!professional.active" @click="approve(professional.id)">Approve</button>
                                <button class="btn btn-danger" v-if="!professional.active" @click="del_pro(professional.id)">Reject</button>
                                <button class="btn btn-danger" v-if="professional.active" @click="del_pro(professional.id)">Delete</button>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <div>
        <h2 class="text-center p-2" style=" padding: 10px; color: white; border-radius: 5px;">Customers</h2>
        <div class="card text-center" style="width: 77rem;">
            <div class="card-header">
                <div class="container text-center">
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5">
                        <div class="col">ID</div>
                        <div class="col">Name</div>
                        <div class="col">Address</div>
                        <div class="col">Pincode</div>
                        <div class="col">Action</div>
                    </div>
                </div>
            </div
        </div>
        <div class="card text-center" style="width: 77rem;">
            <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="(customer,index) in allCustomers">
                    <div class="container text-center">
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5">
                            <div class="col">{{customer.id}}</div>
                            <div class="col">{{customer.full_name}}</div>
                            <div class="col">{{customer.address}}</div>
                            <div class="col">{{customer.pincode}}</div>
                            <div class="col">
                                <button class="btn btn-danger" @click="del_cus(customer.id)">Delete</button>
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
            allProfessionals: [],
            allCustomers: [],
            token: localStorage.getItem('auth-token'),
            error: null
        }
    },
    methods: {
        async approve(pro_id) {
            const res = await fetch(`activate/professional/${pro_id}`, {
                headers: {
                    'Authentication-Token': this.token
                }
            })
            const data = await res.json()
            if(res.ok){
                alert(data.message)
                location.reload()
            }
        },
        async del_pro(pro_id) {
            const res = await fetch(`delete/professional/${pro_id}`, {
                headers: {
                    'Authentication-Token': this.token
                }
            })
            const data = await res.json()
            if(res.ok){
                alert(data.message)
                location.reload()
            }
        },
        async del_cus(cus_id) {
            const res = await fetch(`delete/customer/${cus_id}`, {
                headers: {
                    'Authentication-Token': this.token
                }
            })
            const data = await res.json()
            if(res.ok){
                alert(data.message)
                location.reload()
            }
        }
    },
    async mounted() {
        const res1 = await fetch('/api/professionals', {
            headers: {
                "Authentication-Token": this.token
            }
        })
        const data1 = await res1.json().catch((e) => {})
        if(res1.ok){
            this.allProfessionals = data1
        }
        else{
            this.error = res1.status
        }
        const res2 = await fetch('/api/customers', {
            headers: {
                "Authentication-Token": this.token
            }
        })
        const data2 = await res2.json().catch((e) => {})
        if(res2.ok){
            this.allCustomers = data2
        }
        else{
            this.error = res2.status
        }
    },
}
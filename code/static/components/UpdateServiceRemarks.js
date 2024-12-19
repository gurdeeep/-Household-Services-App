export default{
    template: `
    <div>
        <h2 class="text-center text-primary">Service Remarks</h2>
        <h3 class="text-center text-info">Request ID: {{service_details.id}}</h3>
        <div class="container text-center">
            <div class="row p-1">
                <div class="col">
                    <div class="card text-bg-info mb-3" style="max-width: 18rem;">
                        <h5 class="card-header">Service Name</h5>
                        <div class="card-body">
                            <h5 class="card-title">{{service_details.name}}</h5>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card text-bg-info mb-3" style="max-width: 18rem;">
                        <h5 class="card-header">Description</h5>
                        <div class="card-body">
                            <h5 class="card-title">{{service_details.description}}</h5>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card text-bg-info mb-3" style="max-width: 18rem;">
                        <h5 class="card-header">Professional</h5>
                        <div class="card-body">
                            <h5 class="card-title">{{service_details.professional}}</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center" style="padding: 10px; color: white; border-radius: 5px;">
                <h5>Rating (1-5):</h5>
                <input type="range" class="form-range p-2" min="1" max="5" id="customRange2" style="width:10%" v-model="service_request.rating">
            </div>

            <div class="d-flex justify-content-center" style="padding: 10px; color: white; border-radius: 5px;">
                <h5 class="p-3">Remarks (if any):</h5>
                <input type="text" class="form-control" id="remarks" style="width:20%" v-model="service_request.remarks" placeholder="{{service_request.remarks}}">
            </div>
            <div class="p-5">
                <button class="btn btn-success" @click="submit">Submit</button>
                <button class="btn btn-danger" @click="close">Close</button>
            </div>      
        </div>
    </div>
    `,
    data() {
        return {
            service_details: {
                id: localStorage.getItem('service_request_id'),
                name: localStorage.getItem('name'),
                description: localStorage.getItem('description'),
                professional: localStorage.getItem('professional'),
            },
            service_request: {
                rating: localStorage.getItem('rating'),
                remarks: localStorage.getItem('remarks')
            },
            token: localStorage.getItem('auth-token'),
        }
    },
    methods: {
        async submit() {
            const res = await fetch(`/api/close/service-request/${localStorage.getItem('service_request_id')}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.service_request)
            })
            const data = await res.json()
            if(res.ok){
                alert("Service Remarks Updated")
                this.$router.push({path: '/service-history'})
            }
        },
        async close(){
            this.$router.push({path: '/service-history'})
        }
    },
    async mounted() {
        const res = await fetch(`/service-details/${localStorage.getItem('service_request_id')}`)
        const data = await res.json()
        if(res.ok){
            localStorage.setItem('name', data.name)
            localStorage.setItem('description', data.description)
            localStorage.setItem('professional', data.professional)
            localStorage.setItem('rating', data.rating)
            localStorage.setItem('remarks', data.remarks)
            if(localStorage.getItem('reload')==0){
                localStorage.setItem('reload', 1)
                location.reload()
            }
        }
    }
}
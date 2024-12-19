export default {
    template: `
    <div>
        <div class="d-flex justify-content-center">
            <div class="mb-3 p-5 bg-light" style="width: 55rem;">    
                <h2 class="text-center text-primary p-1">Update Service</h2>
                <form>
                    <div class="row mb-3">
                        <label for="service-name" class="col-sm-2 col-form-label">Name:</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="service-name" v-model="service.name" placeholder="service.name">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="service-price" class="col-sm-2 col-form-label">Price (in Rs.):</label>
                        <div class="col-sm-10">
                            <input type="number" class="form-control" id="service-price" v-model="service.price" placeholder="service.price">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="service-time" class="col-sm-2 col-form-label">Time Required:</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="service-time" v-model="service.time_required" placeholder="service.time">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="service-description" class="col-sm-2 col-form-label">Description:</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="service-description" v-model="service.description" placeholder="service.description">
                        </div>
                    </div>
                    <div class="text-center">
                        <button class="btn btn-primary mt-2" @click="updateService">Update Service</button>
                        <button class="btn btn-danger mt-2" @click="reset">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            service: {
                name: localStorage.getItem('service_name'),
                price: localStorage.getItem('service_price'),
                time_required: localStorage.getItem('service_time'),
                description: localStorage.getItem('service_description')
            },
            token: localStorage.getItem('auth-token'),
        }
    },
    methods: {
        async updateService(){
            const res = await fetch(`/api/update/service/${localStorage.getItem('update_service_id')}`, {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.service)
            })
            const data = await res.json()
            if(res.ok){
                alert(data.message)
                this.$router.push({path: '/'})
            }
        },
        async reset() {
            this.$router.push({path: '/'})
        }
    },
    async mounted() {
        const res = await fetch(`/api/update/service/${localStorage.getItem('update_service_id')}`, {
            headers: {
                'Authentication-Token': this.token
            }
        })
        const data = await res.json()
        if(res.ok){
            localStorage.setItem('service_name', data.name)
            localStorage.setItem('service_price', data.price)
            localStorage.setItem('service_time', data.time_required)
            localStorage.setItem('service_description', data.description)
            if(localStorage.getItem('reload')==0){
                localStorage.setItem('reload', 1)
                location.reload()
            }
        }
    }
}
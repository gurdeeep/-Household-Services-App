export default {
    template: `
    <div>
        <div class="p-2" v-if="role == 'customer'">
            <div class="card text-center bg-light" style="width: 15rem;">
                <div class="card-body">
                    <h5 class="card-title text-primary">{{service.name}}</h5>
                    <h6 class="card-text">{{service.description}}</h6>
                    <h6 class="card-text">{{service.time_required}}</h6>
                    <h6 class="card-text">Rs. {{service.price}}</h6>
                    <button class="btn btn-primary" @click="request(service.id)">Request</button>
                </div>
            </div>
        </div>
        <div class="p-2" v-if="role == 'admin'" style="margin-top: 1rem; margin-bottom: 1rem;">
            <div class="card text-center" style="width: 76rem;">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <div class="container text-center">
                            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
                                <div class="col">{{service.id}}</div>
                                <div class="col">{{service.name}}</div>
                                <div class="col">{{service.price}}</div>
                                <div class="col">
                                    <button class="btn btn-warning" @click="update(service.id)">Edit</button>
                                    <button class="btn btn-danger" @click="del(service.id)">Delete</button>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `,
    props: ['service'],
    data() {
        return {
            token: localStorage.getItem('auth-token'),
            role: localStorage.getItem('role'),
            service_request: {
                "service_id": null,
                "customer_id": null,
            }
        }
    },
    methods: {
        async request(id) {
            this.service_request.service_id = id
            this.service_request.customer_id = localStorage.getItem('user_id')
            const res = await fetch('/api/request/service', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.service_request)
            })
            const data = await res.json()
            if(res.ok){
                alert('Service Requested')
            }
        },
        async del(id) {
            const res = await fetch(`delete/service/${id}`, {
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
        async update(id) {
            localStorage.setItem('update_service_id', id)
            this.$router.push({path: `/update-service`})
        }
    },
    async mounted() {
        const updateServiceId = localStorage.getItem('update_service_id');
        if (!updateServiceId) {
            // // Handle the case where there is no update_service_id
            // console.error('No service ID found in localStorage');
            // // Optionally, redirect to a different page or show an error message
            // this.$router.push({ path: '/' });
            return;
        }
    
        try {
            const res = await fetch(`/api/update/service/${updateServiceId}`, {
                headers: {
                    'Authentication-Token': this.token
                }
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('service_name', data.name);
                localStorage.setItem('service_price', data.price);
                localStorage.setItem('service_time', data.time_required);
                localStorage.setItem('service_description', data.description);
            } else {
                console.error('Failed to fetch service details');
            }
        } catch (error) {
            console.error('Error fetching service details:', error);
        }
    }
}
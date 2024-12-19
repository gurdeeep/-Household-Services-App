export default {
    template: `
    <div>
        <h2 class="text-center p-2 text-white">Search Results</h2>
        <div v-if="services.length === 0" class="text-center">
            <p>No services found.</p>
        </div>
        <div v-else class="card text-center" style="width: 77rem; margin: 0 auto;">
            <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="service in services" :key="service.id">
                    <div class="container text-center">
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
                            <div class="col">{{ service.id }}</div>
                            <div class="col">{{ service.name }}</div>
                            <div class="col">{{ service.price }}</div>
                            <div class="col">{{ service.description }}</div>
                            <div class="col">
                                <button class="btn btn-primary" @click="requestService(service.id)">Request Service</button>
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
            services: []
        }
    },
    methods: {
        async requestService(serviceId) {
            const serviceRequest = {
                service_id: serviceId,
                customer_id: localStorage.getItem('user_id')
            }
            const res = await fetch('/api/request/service', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceRequest)
            })
            const data = await res.json()
            if (res.ok) {
                alert('Service Requested')
            } else {
                alert(data.message)
            }
        }
    },
    async mounted() {
        const query = this.$route.query.q
        const res = await fetch(`/api/search/services?q=${query}`)
        const data = await res.json()
        if (res.ok) {
            this.services = data.services
        }
    }
}
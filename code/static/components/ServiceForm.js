export default {
    template: `
    <div class="service-container">
        <div class="service-box">
            <div class="service-header">
                <i class="fas fa-plus-circle"></i>
                <h2>Add New Service</h2>
            </div>

            <form class="service-form" @submit.prevent="createService">
                <div class="form-group">
                    <label>
                        <i class="fas fa-tag"></i> Service Name
                    </label>
                    <input 
                        type="text" 
                        v-model="service.name"
                        class="form-control"
                        placeholder="Enter service name"
                        required
                    >
                </div>

                <div class="form-group">
                    <label>
                        <i class="fas fa-rupee-sign"></i> Price (in Rs.)
                    </label>
                    <input 
                        type="number" 
                        v-model="service.price"
                        class="form-control"
                        placeholder="Enter price"
                        required
                        min="0"
                    >
                </div>

                <div class="form-group">
                    <label>
                        <i class="fas fa-clock"></i> Time Required
                    </label>
                    <input 
                        type="text" 
                        v-model="service.time_required"
                        class="form-control"
                        placeholder="e.g., 2 hours"
                        required
                    >
                </div>

                <div class="form-group">
                    <label>
                        <i class="fas fa-info-circle"></i> Description
                    </label>
                    <textarea 
                        v-model="service.description"
                        class="form-control"
                        rows="3"
                        placeholder="Enter service description"
                        required
                    ></textarea>
                </div>

                <div class="service-buttons">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Add Service
                    </button>
                    <button type="button" class="btn btn-danger" @click="reset">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            service: {
                name: null,
                price: null,
                time_required: null,
                description: null
            },
            token: localStorage.getItem('auth-token')
        }
    },
    methods: {
        async createService() {
            try {
                const res = await fetch('/api/services', {
                    method: 'POST',
                    headers: {
                        'Authentication-Token': this.token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.service)
                })
                const data = await res.json()
                if(res.ok) {
                    this.$router.push('/')
                } else {
                    throw new Error(data.message)
                }
            } catch (err) {
                alert(err.message)
            }
        },
        reset() {
            this.$router.push('/')
        }
    }
}
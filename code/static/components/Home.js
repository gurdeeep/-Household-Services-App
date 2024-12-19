import AdminHome from "./AdminHome.js"
import ProfessionalHome from "./ProfessionalHome.js"
import CustomerHome from "./CustomerHome.js"
import Services from "./Services.js"

export default{
    template: `
    <div v-if="active=='false'">
        <h1 class="text-center text-danger">User Not Approved</h1>
    </div>
    <div v-else>
        <AdminHome v-if="userRole=='admin'"/>
        <ProfessionalHome v-if="userRole=='professional'"/>
        <CustomerHome v-if="userRole=='customer'"/>
        <div v-if="userRole=='admin'">
            <Services v-for="service in services" :service = "service" v-bind:key="service.id"/>
        </div>
        <div v-if="userRole=='customer'" class="d-flex flex-row">
            <Services v-for="service in services" :service = "service" v-bind:key="service.id"/>
        </div>
        <footer>
            <div class="text-center text-white p-3">
                <p>&copy; 22f3001660, All rights reserved</p>
            </div>
        </footer>    
    </div>
    `,
    data() {
        return {
            userRole: localStorage.getItem('role'),
            active: localStorage.getItem('active'),
            token: localStorage.getItem('auth-token'),
            services: []
        }
    },
    components: {
        AdminHome,
        ProfessionalHome,
        CustomerHome,
        Services
    },
    async mounted() {
        const res = await fetch('/api/services', {
            headers: {
                'Authentication-Token': this.token
            }
        })
        const data = await res.json()
        if(res.ok) {
            this.services = data
        }
        else {
            alert(data.message)
        }
    }
}
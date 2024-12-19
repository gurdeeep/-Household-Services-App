import Home from "./components/Home.js"
import Login from "./components/Login.js"
import Users from "./components/Users.js"
import ServiceForm from "./components/ServiceForm.js"
import UpdateServiceForm from "./components/UpdateServiceForm.js"
import CustomerSignup from "./components/CustomerSignup.js"
import ServiceProfessionalSignup from "./components/ServiceProfessionalSignup.js"
import ServiceHistory from "./components/ServiceHistory.js"
import ServiceRemarks from "./components/ServiceRemarks.js"
import UpdateServiceRemarks from "./components/UpdateServiceRemarks.js"
import AllServiceRequest from "./components/AllServiceRequest.js"
import SearchResults from "./components/SearchResults.js"

const routes = [
    {path: '/', component: Home, name: 'Home'},
    {path: '/login', component: Login, name: 'Login'},
    {path: '/users', component: Users},
    {path: '/create-service', component: ServiceForm},
    {path: '/update-service', component: UpdateServiceForm},
    {path: '/customer-signup', component: CustomerSignup},
    {path: '/service-professional-signup', component: ServiceProfessionalSignup},
    {path: '/service-history', component: ServiceHistory},
    {path: '/service-remarks', component: ServiceRemarks},
    {path: '/update-service-remarks', component: UpdateServiceRemarks},
    {path: '/all-service-request', component: AllServiceRequest},
    {path: '/search', component: SearchResults}
]

export default new VueRouter({
    routes
})
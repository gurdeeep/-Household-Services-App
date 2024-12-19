export default {
    template: `
    <nav class="navbar navbar-expand-lg custom-navbar">
        <div class="container-fluid">
            <a class="navbar-brand brand-hover" href="#">
                <img src="/static/images/favicon.ico" alt="Logo" width="35" height="35" class="brand-logo">
                <span class="brand-text">HomeHub</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul class="navbar-nav align-items-center">
                    <li class="nav-item">
                        <router-link class="nav-link nav-hover" v-if="is_login" to="/">
                            <i class="fas fa-home"></i> Home
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="role=='admin'">
                        <router-link class="nav-link nav-hover" to="/users">
                            <i class="fas fa-users"></i> Users
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="role=='admin'">
                        <router-link class="nav-link nav-hover" to="/all-service-request">
                            <i class="fas fa-tasks"></i> Service Requests
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="role=='customer'">
                        <router-link class="nav-link nav-hover" to="/service-history">
                            <i class="fas fa-history"></i> Service History
                        </router-link>
                    </li>
                    <li class="nav-item search-box" v-if="role=='customer'">
                        <div class="input-group">
                            <input type="text" v-model="searchQuery" placeholder="Search Services" class="form-control search-input">
                            <button class="btn btn-primary search-btn" @click="searchServices">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </li>
                    <li class="nav-item" v-if="active=='false'">
                        <button class="nav-link btn-logout" @click="logout">
                            <i class="fas fa-sign-in-alt"></i> Back To Login
                        </button>
                    </li>
                    <li class="nav-item" v-if="is_login && active=='true'">
                        <button class="nav-link btn-logout" @click="logout">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `,
    data() {
        return {
            role: localStorage.getItem('role'),
            is_login: localStorage.getItem('auth-token'),
            active: localStorage.getItem('active'),
            searchQuery: ''
        }
    },
    methods: {
        logout() {
            localStorage.clear()
            this.$router.push('/login')
        },
        searchServices() {
            this.$router.push({ path: '/search', query: { q: this.searchQuery } })
        }
    }
}
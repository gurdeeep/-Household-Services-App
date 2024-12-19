export default {
    template: `
    <div class="auth-container">
        <div class="auth-box signup-box">
            <div class="auth-header">
                <h2>Create Customer Account</h2>
                <p class="subtitle">Join our community today</p>
            </div>

            <div class="error-message" v-if="error">{{error}}</div>

            <form @submit.prevent="register" class="auth-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label><i class="fas fa-envelope"></i> Email</label>
                        <input 
                            type="email" 
                            v-model="cred.email"
                            placeholder="name@example.com"
                            required
                            class="form-input"
                        >
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-lock"></i> Password</label>
                        <div class="password-input">
                            <input 
                                :type="showPassword ? 'text' : 'password'"
                                v-model="cred.password"
                                required
                                class="form-input"
                            >
                            <button 
                                type="button"
                                class="toggle-password"
                                @click="showPassword = !showPassword"
                            >
                                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-user"></i> Full Name</label>
                        <input 
                            type="text" 
                            v-model="cred.full_name"
                            required
                            class="form-input"
                        >
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-map-marker-alt"></i> Address</label>
                        <input 
                            type="text" 
                            v-model="cred.address"
                            required
                            class="form-input"
                        >
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-map-pin"></i> Pincode</label>
                        <input 
                            type="text" 
                            v-model="cred.pincode"
                            required
                            class="form-input"
                        >
                    </div>
                </div>

                <button type="submit" class="submit-btn">
                    <i class="fas fa-user-plus"></i> Create Account
                </button>
            </form>

            <div class="auth-footer">
                <router-link to="/login" class="login-link">
                    Already have an account? Login
                </router-link>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            cred: {
                email: null,
                password: null,
                full_name: null,
                address: null,
                pincode: null
            },
            error: null,
            showPassword: false
        }
    },
    methods: {
        async register() {
            try {
                const res = await fetch('/api/customers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.cred)
                })
                const data = await res.json()
                if(res.ok) {
                    this.$router.push('/login')
                } else {
                    this.error = data.message
                }
            } catch (err) {
                this.error = 'Registration failed. Please try again.'
            }
        }
    }
}
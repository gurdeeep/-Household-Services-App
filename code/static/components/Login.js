export default {
    template: `
    <div class="auth-container">
        <div class="auth-box login-box">
            <div class="auth-header">
                <h2>Welcome Back</h2>
                <p class="subtitle">Login to access your account</p>
            </div>
            
            <div class="professional-link">
                <router-link to="/service-professional-signup" class="pro-link">
                    <i class="fas fa-user-plus"></i> Register as Professional
                </router-link>
            </div>

            <div class="error-message" v-if="error">{{error}}</div>
            
            <form @submit.prevent="login" class="auth-form">
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

                <button type="submit" class="submit-btn">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
            </form>

            <div class="auth-footer">
                <router-link to="/customer-signup" class="create-account">
                    Create New Account
                </router-link>
            </div>
        </div>
        
    </div>
    `,
    data() {
        return {
            cred: {
                email: null,
                password: null
            },
            error: null,
            showPassword: false
        }
    },
    methods: {
        async login() {
            try {
                const res = await fetch('/user-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.cred)
                })
                const data = await res.json()
                if(res.ok) {
                    localStorage.setItem('auth-token', data.token)
                    localStorage.setItem('role', data.role)
                    localStorage.setItem('active', data.active)
                    localStorage.setItem('user_id', data.id)
                    localStorage.setItem('id', data.email.charAt(data.email.length - 11))
                    this.$router.push('/')
                } else {
                    this.error = data.message
                }
            } catch (err) {
                this.error = 'Login failed. Please try again.'
            }
        }
    }
}
export default {
    template: `
    <div class="professional-signup-container">
        <div class="signup-box">
            <div class="signup-header">
                <i class="fas fa-user-tie header-icon"></i>
                <h2>Service Professional Signup</h2>
                <p class="subtitle">Join our professional network</p>
            </div>

            <div class="error-message" v-if="error">
                <i class="fas fa-exclamation-circle"></i> {{error}}
            </div>

            <form @submit.prevent="register" class="signup-form">
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
                                placeholder="Enter your password"
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
                            placeholder="Enter your full name"
                        >
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-tools"></i> Service</label>
                        <select 
                            v-model="cred.service"
                            required
                            class="form-input"
                        >
                            <option value="">Select your service</option>
                            <option value="plumbing">Plumbing</option>
                            <option value="electrical">Electrical</option>
                            <option value="carpentry">Carpentry</option>
                            <option value="cleaning">Cleaning</option>
                            <option value="painting">Painting</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-briefcase"></i> Experience (years)</label>
                        <input 
                            type="number" 
                            v-model="cred.experience"
                            required
                            min="0"
                            class="form-input"
                            placeholder="Years of experience"
                        >
                    </div>

                    <div class="form-group span-2">
                        <label><i class="fas fa-map-marker-alt"></i> Address</label>
                        <textarea 
                            v-model="cred.address"
                            required
                            class="form-input"
                            rows="2"
                            placeholder="Enter your complete address"
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-map-pin"></i> Pincode</label>
                        <input 
                            type="text" 
                            v-model="cred.pincode"
                            required
                            pattern="[0-9]{6}"
                            class="form-input"
                            placeholder="6-digit pincode"
                        >
                    </div>
                </div>

                <button type="submit" class="submit-btn">
                    <i class="fas fa-user-plus"></i> Register as Professional
                </button>
            </form>

            <div class="form-footer">
                <router-link to="/login" class="login-link">
                    <i class="fas fa-sign-in-alt"></i> Already registered? Login here
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
                service: '',
                experience: null,
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
                const res = await fetch('/api/professionals', {
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
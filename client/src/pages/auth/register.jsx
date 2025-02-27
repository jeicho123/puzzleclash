import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Logo from "@/components/logo"


export default function SignUpPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Check username
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        // Check password
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Check password confirmation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="w-[400px]">
                <Logo />
                <Card className="w-full">
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="text-left">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        placeholder="Choose a username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className={errors.username ? "border-red-500" : ""}
                                    />
                                    {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className={errors.password ? "border-red-500" : ""}
                                    />
                                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className={errors.confirmPassword ? "border-red-500" : ""}
                                    />
                                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-6">Sign Up</Button>
                        </form>
                    </CardContent>
                </Card>
                <div className="text-center w-full mt-4">
                    <Link to="/login" className="text-sm text-blue-600 hover:underline">
                        Already have an account? Log in
                    </Link>
                </div>
            </div>
        </main>
    )
}


// Mock data implementation
const MOCK_DELAY = 500;

export const base44 = {
    auth: {
        me: async () => {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            const user = localStorage.getItem('base44_user');
            if (user) return JSON.parse(user);
            // For demo purposes, auto-login if no user
            const demoUser = { full_name: "مدیر سیستم", email: "admin@example.com" };
            localStorage.setItem('base44_user', JSON.stringify(demoUser));
            return demoUser;
        },
        logout: async () => {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            localStorage.removeItem('base44_user');
            window.location.href = '/';
        },
        redirectToLogin: (returnUrl) => {
            // Mock login redirect - just logging them in effectively
            console.log("Redirecting to login...", returnUrl);
            const demoUser = { full_name: "کاربر آزمایشی", email: "demo@example.com" };
            localStorage.setItem('base44_user', JSON.stringify(demoUser));
            window.location.reload();
        }
    },
    entities: {
        Company: {
            filter: async (query) => {
                await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
                // Return mock company if created_by matches
                return [{
                    id: 1,
                    name: "شرکت نمونه فناوران",
                    activity_subject: "طراحی نرم‌افزار",
                    status: "تکمیل شده",
                    created_by: query.created_by
                }];
            }
        },
        FinancingRequest: {
            filter: async (query) => {
                await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
                return [
                    {
                        id: 101,
                        status: "در انتظار بررسی",
                        requested_amount: 5000,
                        financing_method_id: 1,
                        created_by: query.created_by
                    },
                    {
                        id: 102,
                        status: "تأیید شده",
                        requested_amount: 12000,
                        financing_method_id: 2,
                        created_by: query.created_by
                    }
                ]
            }
        },
        FinancingMethod: {
            filter: async () => {
                await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
                return [
                    { id: 1, name: "اوراق مرابحه", is_active: true },
                    { id: 2, name: "صکوک اجاره", is_active: true },
                    { id: 3, name: "صکوک استصناع", is_active: true }
                ]
            }
        }
    }
};

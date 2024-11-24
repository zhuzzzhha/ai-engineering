import { StartPage, AuthorizationPage, CreateModelPage } from "../../pages"

export const routes = [
    {
        component: <StartPage />,
        path: '/'
    },
    {
        component: <AuthorizationPage />,
        path: '/authorization'
    },
    {
        component: <CreateModelPage />,
        path: '/createModelPage'
    }
]
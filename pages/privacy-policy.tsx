import Layout from '../components/ui/Layout'
import dynamic from 'next/dynamic'
const Scene = dynamic(() => import('../components/xr/scene'), { ssr: false })
// import Login from '../components/ui/Login'
// TODO: Make an actual privacy policy page
export const PrivacyPolicyPage = () => {
  return (
    <Layout pageTitle="Home">
      {/* <Login /> */}
      <Scene />
    </Layout>
  )
}

export default PrivacyPolicyPage

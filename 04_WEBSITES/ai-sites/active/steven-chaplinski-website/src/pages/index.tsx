import React from 'react'
import Link from 'next/link'
import MainLayout from '@/layouts/MainLayout'
import { ArrowRight, Code, Zap, Palette, Wrench, CheckCircle } from 'lucide-react'

const HomePage: React.FC = () => {
  const services = [
    {
      title: 'AI Automation Consulting',
      description: 'Custom automation solutions for business optimization',
      icon: Zap,
      href: '/services/ai-automation'
    },
    {
      title: 'Creative Technology',
      description: 'Multimedia processing and content creation',
      icon: Palette,
      href: '/services/creative-technology'
    },
    {
      title: 'Technical Development',
      description: 'Full-stack development and engineering',
      icon: Code,
      href: '/services/technical-development'
    },
    {
      title: 'Business Optimization',
      description: 'Process improvement and efficiency',
      icon: Wrench,
      href: '/services/business-optimization'
    }
  ]

  const brands = [
    {
      name: 'AvatarArts.org',
      description: 'Creative Automation Platform',
      href: '/brands/avatararts',
      icon: Palette,
      color: 'text-purple-600'
    },
    {
      name: 'QuantumForgeLabs',
      description: 'Technical Solutions',
      href: '/brands/quantumforge',
      icon: Code,
      color: 'text-blue-600'
    },
    {
      name: 'GPTJunkie',
      description: 'AI Tools & Scripts',
      href: '/brands/gptjunkie',
      icon: Wrench,
      color: 'text-green-600'
    }
  ]

  const achievements = [
    '10+ years in AI automation and creative technology',
    '$500,000+ in professional development value',
    'Top-tier technical solutions and creative automation',
    'Expert in AI integration and business optimization'
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Steven Chaplinski
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              AI Alchemist & Creative Automation Engineer
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
              Transforming businesses through innovative AI solutions, creative automation, 
              and technical excellence. Professional portfolio showcasing advanced 
              automation platforms and creative technology solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/portfolio"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center"
              >
                View Portfolio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Summary */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Excellence
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Delivering top-tier technical solutions with measurable business impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Achievements</h3>
              <ul className="space-y-3">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Score</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">10/10</div>
                  <p className="text-gray-600 mb-4">Professional-grade implementation</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions for AI automation, creative technology, and business optimization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <service.icon className="h-8 w-8 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Brand Portfolio
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Specialized platforms for different aspects of creative automation and technical solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {brands.map((brand, index) => (
              <Link
                key={index}
                href={brand.href}
                className="bg-gray-50 p-8 rounded-lg hover:bg-gray-100 transition-colors text-center"
              >
                <brand.icon className={`h-12 w-12 ${brand.color} mx-auto mb-4`} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {brand.name}
                </h3>
                <p className="text-gray-600">{brand.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Let's discuss how AI automation and creative technology can optimize your operations and drive growth.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center"
          >
            Start Your Project
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </MainLayout>
  )
}

export default HomePage

import { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Globe, 
  Users, 
  TrendingUp, 
  Zap,
  Heart,
  Coffee,
  MapPin,
  Clock,
  DollarSign,
  Rocket,
  Code,
  Headphones,
  BarChart,
  Shield,
  Briefcase,
  Star,
  ArrowRight,
  Mail
} from "lucide-react"

export const metadata: Metadata = {
  title: "Careers at SIMRYO - Join Our Global Team",
  description: "Build your career with SIMRYO and help connect travelers worldwide. Explore remote opportunities, competitive benefits, and be part of revolutionizing global connectivity.",
  keywords: "careers at simryo, jobs, remote work, global team, esim careers, travel technology jobs"
}

const benefits = [
  {
    icon: Globe,
    title: "Remote-First Culture",
    description: "Work from anywhere in the world with flexible schedules and global collaboration."
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health coverage and wellness programs for you and your family."
  },
  {
    icon: TrendingUp,
    title: "Growth Opportunities",
    description: "Continuous learning budget and career advancement in a fast-growing company."
  },
  {
    icon: Coffee,
    title: "Work-Life Balance",
    description: "Flexible hours, unlimited PTO, and a culture that values your well-being."
  },
  {
    icon: Zap,
    title: "Innovation Focus",
    description: "Work with cutting-edge eSIM technology and shape the future of connectivity."
  },
  {
    icon: Users,
    title: "Global Impact",
    description: "Help millions of travelers stay connected and make a real difference worldwide."
  }
]

const positions = [
  {
    id: 1,
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    icon: Code,
    description: "Build scalable backend systems and APIs that power our global eSIM platform.",
    requirements: ["5+ years of backend development", "Experience with Node.js/Go", "Cloud infrastructure (AWS/GCP)"],
    skills: ["API Development", "Microservices", "Database Design", "Cloud Architecture"]
  },
  {
    id: 2,
    title: "Customer Success Manager",
    department: "Customer Experience",
    location: "Remote",
    type: "Full-time",
    icon: Headphones,
    description: "Ensure exceptional customer experiences and drive customer satisfaction globally.",
    requirements: ["3+ years customer success", "Travel industry experience", "Multiple languages preferred"],
    skills: ["Customer Relations", "Problem Solving", "Communication", "Data Analysis"]
  },
  {
    id: 3,
    title: "Product Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    icon: BarChart,
    description: "Drive product positioning and go-to-market strategies for our eSIM solutions.",
    requirements: ["4+ years product marketing", "B2C tech experience", "Travel/telecom background"],
    skills: ["Market Research", "Product Strategy", "Content Marketing", "Analytics"]
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    icon: Shield,
    description: "Maintain and scale our infrastructure to support millions of global users.",
    requirements: ["3+ years DevOps", "Kubernetes/Docker", "CI/CD pipelines", "Security focus"],
    skills: ["Infrastructure", "Automation", "Monitoring", "Security"]
  },
  {
    id: 5,
    title: "Business Development Manager",
    department: "Sales",
    location: "Remote",
    type: "Full-time",
    icon: Briefcase,
    description: "Build strategic partnerships with carriers and expand our global network.",
    requirements: ["5+ years B2B sales", "Telecom industry experience", "International markets"],
    skills: ["Partnership Development", "Negotiation", "Market Expansion", "Relationship Building"]
  },
  {
    id: 6,
    title: "UX/UI Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    icon: Star,
    description: "Design intuitive user experiences for our mobile app and web platform.",
    requirements: ["3+ years UX/UI design", "Mobile app experience", "Design systems"],
    skills: ["User Research", "Prototyping", "Visual Design", "User Testing"]
  }
]

const values = [
  {
    title: "Global Mindset",
    description: "We think globally and act locally, understanding diverse cultures and markets."
  },
  {
    title: "Customer First",
    description: "Every decision we make is centered around delivering exceptional customer value."
  },
  {
    title: "Innovation Drive",
    description: "We continuously push boundaries and embrace new technologies and ideas."
  },
  {
    title: "Team Collaboration",
    description: "We believe in the power of teamwork and transparent communication."
  }
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
              Join Our Team
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Build the Future of
              <span className="block text-blue-600">
                Global Connectivity
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join SIMRYO and help connect millions of travelers worldwide. 
              We're building the next generation of global communication technology.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl"
              >
                <Rocket className="mr-2 h-5 w-5" />
                View Open Positions
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg rounded-xl"
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Join SIMRYO?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer competitive benefits and a culture that values innovation, 
              growth, and work-life balance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                    <benefit.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our growing team and help shape the future of global connectivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {positions.map((position) => (
              <Card key={position.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <position.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">{position.title}</CardTitle>
                        <p className="text-sm text-gray-600">{position.department}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {position.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {position.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{position.description}</p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {position.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {position.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work and define our culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg p-6">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Join Our Mission?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Don't see a position that fits? We're always looking for talented people. 
              Send us your resume and let's talk!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl"
              >
                <Mail className="mr-2 h-5 w-5" />
                Send Resume
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-xl"
              >
                Learn More About Us
              </Button>
            </div>
            <p className="mt-6 text-sm text-blue-100">
              Email us at: <a href="mailto:info@simryo.com" className="underline hover:text-white">info@simryo.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
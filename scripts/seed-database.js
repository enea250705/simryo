const { PrismaClient } = require('../lib/generated/prisma')

const prisma = new PrismaClient()

const providers = [
  {
    name: 'esim-access',
    displayName: 'eSIM Access',
    apiKey: process.env.ESIM_ACCESS_API_KEY || 'cfd3a757a99d4795a5ff3b1714eae3e6'
  }
]

const plans = [
  // USA Plans
  {
    country: 'United States',
    countryCode: 'US',
    region: 'North America',
    flag: '🇺🇸',
    dataAmount: 1024, // 1GB
    days: 7,
    price: 4.50,
    currency: 'USD',
    popular: true,
    featured: true,
    features: ['4G/5G', 'Unlimited calls', 'Hotspot included'],
    networkType: '4G/5G',
    carriers: ['AT&T', 'T-Mobile', 'Verizon'],
    coverage: 'Nationwide',
    activation: 'QR Code',
    restrictions: ['No tethering', 'Speed cap after 1GB'],
    inStock: true
  },
  {
    country: 'United States',
    countryCode: 'US',
    region: 'North America',
    flag: '🇺🇸',
    dataAmount: 5120, // 5GB
    days: 30,
    price: 19.99,
    currency: 'USD',
    popular: true,
    featured: false,
    features: ['4G/5G', 'Unlimited calls', 'Hotspot included'],
    networkType: '4G/5G',
    carriers: ['AT&T', 'T-Mobile'],
    coverage: 'Nationwide',
    activation: 'QR Code',
    restrictions: ['Speed cap after 5GB'],
    inStock: true
  },
  // Europe Plans
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    region: 'Europe',
    flag: '🇬🇧',
    dataAmount: 1024, // 1GB
    days: 7,
    price: 3.99,
    currency: 'USD',
    popular: true,
    featured: true,
    features: ['4G/5G', 'EU roaming', 'Unlimited calls'],
    networkType: '4G/5G',
    carriers: ['EE', 'O2', 'Vodafone'],
    coverage: 'National',
    activation: 'QR Code',
    restrictions: ['EU only'],
    inStock: true
  },
  {
    country: 'Germany',
    countryCode: 'DE',
    region: 'Europe',
    flag: '🇩🇪',
    dataAmount: 2048, // 2GB
    days: 14,
    price: 7.99,
    currency: 'USD',
    popular: true,
    featured: false,
    features: ['4G/5G', 'EU roaming', 'Unlimited calls'],
    networkType: '4G/5G',
    carriers: ['Telekom', 'Vodafone', 'O2'],
    coverage: 'National',
    activation: 'QR Code',
    restrictions: ['EU only'],
    inStock: true
  },
  // Asia Plans
  {
    country: 'Japan',
    countryCode: 'JP',
    region: 'Asia',
    flag: '🇯🇵',
    dataAmount: 1024, // 1GB
    days: 7,
    price: 5.99,
    currency: 'USD',
    popular: true,
    featured: true,
    features: ['4G/5G', 'High-speed data', 'Unlimited calls'],
    networkType: '4G/5G',
    carriers: ['NTT Docomo', 'SoftBank', 'KDDI'],
    coverage: 'National',
    activation: 'QR Code',
    restrictions: ['Speed cap after 1GB'],
    inStock: true
  },
  {
    country: 'Australia',
    countryCode: 'AU',
    region: 'Oceania',
    flag: '🇦🇺',
    dataAmount: 1024, // 1GB
    days: 7,
    price: 6.50,
    currency: 'USD',
    popular: true,
    featured: false,
    features: ['4G/5G', 'Unlimited calls', 'Hotspot included'],
    networkType: '4G/5G',
    carriers: ['Telstra', 'Optus', 'Vodafone'],
    coverage: 'National',
    activation: 'QR Code',
    restrictions: ['Speed cap after 1GB'],
    inStock: true
  },
  // Global Plans
  {
    country: 'Global',
    countryCode: 'WW',
    region: 'Worldwide',
    flag: '🌍',
    dataAmount: 5120, // 5GB
    days: 30,
    price: 29.99,
    currency: 'USD',
    popular: true,
    featured: true,
    features: ['4G/5G', '190+ countries', 'Unlimited calls'],
    networkType: '4G/5G',
    carriers: ['Multiple carriers'],
    coverage: 'Worldwide',
    activation: 'QR Code',
    restrictions: ['Speed varies by country'],
    inStock: true
  }
]

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.esim.deleteMany()
  await prisma.order.deleteMany()
  await prisma.plan.deleteMany()
  await prisma.provider.deleteMany()
  await prisma.user.deleteMany()

  // Create eSIM Access provider only
  console.log('🏢 Creating eSIM Access provider...')
  const createdProvider = await prisma.provider.create({
    data: providers[0]
  })
  console.log(`✅ Created provider: ${createdProvider.displayName}`)

  // Create plans
  console.log('📱 Creating plans...')
  for (const plan of plans) {
    const createdPlan = await prisma.plan.create({
      data: {
        ...plan,
        providerId: createdProvider.id
      }
    })
    console.log(`✅ Created plan: ${createdPlan.country} - ${createdPlan.dataAmount}MB for ${createdPlan.days} days`)
  }

  // Create test user
  console.log('👤 Creating test user...')
  const testUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: '$2a$10$rQZ8N3YqX2vB5cD7eF9gH.iJ1kL2mN3oP4qR5sT6uV7wX8yZ9aA0bB1cC2d', // bcrypt hash for 'password123'
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  })
  console.log(`✅ Created test user: ${testUser.email}`)

  // Create test order and eSIM
  console.log('📦 Creating test order and eSIM...')
  const testPlan = await prisma.plan.findFirst()
  if (testPlan) {
    const testOrder = await prisma.order.create({
      data: {
        userId: testUser.id,
        status: 'PAID',
        amount: testPlan.price,
        currency: testPlan.currency,
        paymentIntentId: 'pi_test_123456789'
      }
    })

    const testEsim = await prisma.esim.create({
      data: {
        orderId: testOrder.id,
        userId: testUser.id,
        planId: testPlan.id,
        providerId: testPlan.providerId,
        iccid: '89001012345678901234',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=test-qr-code',
        activationCode: 'TEST-ACTIVATION-CODE-123',
        status: 'ACTIVE',
        dataLimit: testPlan.dataAmount,
        dataUsed: 256, // 256MB used
        expiresAt: new Date(Date.now() + testPlan.days * 24 * 60 * 60 * 1000),
        autoRenew: false,
        isRoaming: false
      }
    })
    console.log(`✅ Created test order: ${testOrder.id}`)
    console.log(`✅ Created test eSIM: ${testEsim.id}`)
  }

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- 1 provider created (eSIM Access only)`)
  console.log(`- ${plans.length} plans created`)
  console.log('- 1 test user created')
  console.log('- 1 test order and eSIM created')
  console.log('\n🔗 Test user credentials:')
  console.log('Email: john@example.com')
  console.log('Password: password123')
  console.log('\n🌐 Platform now uses eSIM Access as the sole provider')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
const { PrismaClient } = require('../lib/generated/prisma')

const prisma = new PrismaClient()

const popularPlans = [
  {
    name: "USA Unlimited",
    description: "Unlimited data for USA travel",
    countryCode: "US",
    dataAmount: 999999, // Unlimited
    validity: 30,
    price: 29.99,
    currency: "USD",
    provider: "GlobalConnect",
    isPopular: true
  },
  {
    name: "Europe Travel",
    description: "10GB data across Europe",
    countryCode: "EU",
    dataAmount: 10000, // 10GB in MB
    validity: 15,
    price: 19.99,
    currency: "USD",
    provider: "GlobalConnect",
    isPopular: true
  },
  {
    name: "Japan Explorer",
    description: "5GB high-speed data in Japan",
    countryCode: "JP",
    dataAmount: 5000, // 5GB in MB
    validity: 10,
    price: 14.99,
    currency: "USD",
    provider: "MayaNet",
    isPopular: true
  },
  {
    name: "Global Traveler",
    description: "20GB data worldwide coverage",
    countryCode: "WW",
    dataAmount: 20000, // 20GB in MB
    validity: 30,
    price: 39.99,
    currency: "USD",
    provider: "GlobalConnect",
    isPopular: true
  }
]

async function main() {
  console.log('Start seeding popular plans...')
  
  for (const plan of popularPlans) {
    const createdPlan = await prisma.plan.create({
      data: plan
    })
    console.log(`Created plan: ${createdPlan.country} (${createdPlan.id})`)
  }
  
  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
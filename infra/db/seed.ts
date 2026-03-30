import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing old data...')
  await prisma.alert.deleteMany()
  await prisma.attendanceRecord.deleteMany()
  await prisma.nutritionRecord.deleteMany()
  await prisma.child.deleteMany()
  await prisma.user.deleteMany()
  await prisma.ecdCenter.deleteMany()

  console.log('Seeding Database...')

  const center = await prisma.ecdCenter.create({
    data: {
      name: 'Kigali Central ECD',
      location: 'Kigali City'
    }
  })

  const hash = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      emailOrPhone: 'admin',
      passwordHash: hash,
      role: 'admin'
    }
  })

  // Create Parent User FIRST before the Child
  const parent = await prisma.user.create({
    data: {
      name: 'Kwitonda Parent',
      emailOrPhone: 'parent',
      passwordHash: hash,
      role: 'parent'
    }
  })

  const teacher = await prisma.user.create({
    data: {
      name: 'Tr. Umutoni M.',
      emailOrPhone: 'teacher',
      passwordHash: hash,
      role: 'teacher',
      ecdCenterId: center.id
    }
  })

  // Create Child linked to Parent
  const child = await prisma.child.create({
    data: {
      name: 'Kwitonda L.',
      age: 4,
      parentId: parent.id,
      centerId: center.id
    }
  })

  console.log('Database seeded successfully!')
  console.log('Admin:', admin.emailOrPhone)
  console.log('Teacher:', teacher.emailOrPhone)
  console.log('Parent:', parent.emailOrPhone)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

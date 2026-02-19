import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Починаємо seed...');

  const user = await prisma.user.create({
    data: {
      email: 'test' + Date.now() + '@example.com',
      name: 'Test User',
    },
  });

  const organization = await prisma.organization.create({
    data: {
      name: 'Test Organization',
      createdByUserId: user.id,
    },
  });

  await prisma.membership.create({
    data: {
      userId: user.id,
      organizationId: organization.id,
      role: 'OWNER',
    },
  });

  const stage1 = await prisma.stage.create({
    data: { name: 'Lead', order: 1, organizationId: organization.id },
  });
  const stage2 = await prisma.stage.create({
    data: { name: 'Contact Made', order: 2, organizationId: organization.id },
  });
  const stage3 = await prisma.stage.create({
    data: { name: 'Proposal Sent', order: 3, organizationId: organization.id },
  });

  const company1 = await prisma.company.create({
    data: {
      name: 'Acme Corp',
      email: 'info@acme.com',
      phone: '555-1234',
      organizationId: organization.id,
      ownerId: user.id,
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: 'Globex Inc',
      email: 'test@gmail.com',
      phone: '555-5678',
      organizationId: organization.id,
      ownerId: user.id,
    },
  });

  const contact1 = await prisma.contact.create({
    data: {
      name: 'John Doe',
      email: 'test' + Date.now() + '@example.com',
      phone: '123456789',
      companyId: company1.id,
      organizationId: organization.id,
      ownerId: user.id,
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      name: 'Jane Smith',
      email: 'test' + (Date.now() + 1) + '@example.com',
      phone: '987654321',
      companyId: company2.id,
      organizationId: organization.id,
      ownerId: user.id,
    },
  });

  const deal1 = await prisma.deal.create({
    data: {
      title: 'Website Redesign',
      value: 1000,
      stageId: stage1.id,
      status: 'OPEN',
      organizationId: organization.id,
      ownerId: user.id,
      contactId: contact1.id,
      companyId: company1.id,
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      title: 'Consulting Retainer',
      value: 2000,
      stageId: stage2.id,
      status: 'OPEN',
      organizationId: organization.id,
      ownerId: user.id,
      contactId: contact2.id,
      companyId: company2.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Follow up with John',
      type: 'CALL',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      organizationId: organization.id,
      assignedToUserId: user.id,
      contactId: contact1.id,
      dealId: deal1.id,
    },
  });

  console.log('Seed успішно завершено!');
  console.log({ user: user.email, organization: organization.name });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

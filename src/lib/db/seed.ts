import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const ARTICLES = [
  {
    title: 'How to Start a Career in Trucking as a New Driver',
    category: 'general',
    author: 'Truck King Hub',
    excerpt: 'Learn how to start a trucking career, get a CDL, choose the right training path, and find your first driving job.',
    body: `Starting a career in trucking is one of the most practical ways to build a stable, well-paying profession without spending years in school. If you want to become a truck driver, the first step is understanding the path from beginner to licensed professional.

The most important requirement is earning your Commercial Driver's License, or CDL. Before that, you'll need to meet basic qualifications such as age requirements, a clean driving record, and the ability to pass a DOT physical exam and drug test. Once you qualify, you can enroll in a CDL training program that prepares you for both the written and road tests.

New drivers often choose between company-sponsored training and private trucking schools. Company-sponsored programs can lower upfront costs, while private schools may offer more flexibility and faster scheduling. The best choice depends on your budget, timeline, and long-term goals.

After getting your CDL, the next step is finding your first trucking job. Many new drivers begin with regional or over-the-road positions to gain experience quickly. This early stage is about learning how to manage time, trip planning, load safety, fuel efficiency, and highway driving under different conditions.

A successful trucking career also depends on attitude. Reliability, professionalism, and safety habits matter just as much as driving skill. Drivers who show consistency and responsibility can move into better routes, higher pay, and eventually specialized opportunities such as refrigerated freight, flatbed hauling, or owner-operator work.

If you are serious about entering the trucking industry, start with research, training, and a clear plan. The trucking world rewards people who are disciplined, patient, and ready to learn.`,
    metaTitle: 'How to Start a Career in Trucking as a New Driver',
    metaDescription: 'Learn how to start a trucking career, get a CDL, choose the right training path, and find your first driving job.',
    tags: ['trucking career', 'CDL training', 'new truck driver jobs'],
    coverImage: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80&auto=format&fit=crop',
    featured: true,
  },
  {
    title: 'Top Tips for Long-Haul Truck Drivers to Stay Alert on the Road',
    category: 'lifestyle',
    author: 'Truck King Hub',
    excerpt: 'Discover practical long-haul truck driving safety tips to stay awake, focused, and alert during long trips.',
    body: `Long-haul truck drivers face one of the biggest challenges in transportation: staying alert during long hours behind the wheel. Fatigue is one of the leading causes of highway accidents, which means every driver needs a strong strategy for safety and focus.

The first rule is to get proper rest before a trip. Sleep is not optional in trucking. Even if your schedule is tight, driving while tired is dangerous and can lead to slower reaction times, poor judgment, and microsleeps. A consistent sleep routine before long hauls can make a major difference.

Second, plan your route carefully. Knowing where you will stop for fuel, food, and rest helps reduce stress and keeps you from pushing too hard. Smart route planning also gives you the chance to avoid heavy traffic and difficult weather whenever possible.

Hydration and nutrition matter too. Heavy meals and sugary snacks can cause energy crashes, while water and balanced meals help maintain steady focus. Many experienced truckers also avoid relying too heavily on energy drinks, since the boost is often short-lived and followed by a crash.

Movement is another key factor. Stretching during breaks, walking around the truck stop, and getting blood flowing can reduce stiffness and help you feel more awake. A tired body often leads to a tired mind.

Finally, know your limits. If you feel drowsy, do not try to push through it. Taking a safe break is always better than risking an accident. In long-haul trucking, alertness is not just about comfort. It is about survival, safety, and professionalism.`,
    metaTitle: 'Top Tips for Long-Haul Truck Drivers to Stay Alert on the Road',
    metaDescription: 'Discover practical long-haul truck driving safety tips to stay awake, focused, and alert during long trips.',
    tags: ['long-haul truck driver safety', 'stay alert driving', 'truck driver fatigue'],
    coverImage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    title: 'Owner-Operator vs Company Driver: Which Is Better?',
    category: 'general',
    author: 'Truck King Hub',
    excerpt: 'Compare owner-operator and company driver careers in trucking, including pay, freedom, expenses, and long-term goals.',
    body: `One of the biggest decisions in a trucking career is choosing between becoming a company driver or an owner-operator. Both paths offer advantages, but the right option depends on your goals, budget, and appetite for responsibility.

A company driver works for a trucking company and usually receives a steady paycheck, benefits, and less financial risk. This is often the best option for new drivers because it allows them to build experience without worrying about truck payments, insurance, maintenance, or business operations. Company drivers can focus on driving while the employer handles many of the business-side responsibilities.

An owner-operator, on the other hand, owns or leases their truck and operates as an independent business. This path can offer greater income potential and more control over loads, schedules, and clients. However, it also comes with higher risk. Owner-operators must manage fuel costs, repairs, permits, accounting, taxes, and downtime.

The better choice depends on what you value most. If you want stability and simplicity, company driving is a strong start. If you are business-minded, financially prepared, and want more independence, owner-operator work may be a better long-term fit.

Many drivers begin as company drivers, gain experience, and then transition into owner-operator roles once they understand the industry better. That approach reduces risk and helps drivers make a more informed business decision.

In trucking, there is no one-size-fits-all answer. The best path is the one that fits your current stage, your financial situation, and your career goals.`,
    metaTitle: 'Owner-Operator vs Company Driver: Which Is Better?',
    metaDescription: 'Compare owner-operator and company driver careers in trucking, including pay, freedom, expenses, and long-term goals.',
    tags: ['owner operator vs company driver', 'trucking career choice', 'owner operator trucking'],
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    title: 'How the Trucking Industry Is Adapting to New Technology',
    category: 'news',
    author: 'Truck King Hub',
    excerpt: 'Explore how new trucking technology is changing fleet operations, safety, route planning, fuel efficiency, and logistics.',
    body: `The trucking industry is changing fast, and technology is driving much of that transformation. From digital dispatch systems to safety tools and automated fleet management, modern trucking is becoming more connected, efficient, and data-driven.

One of the biggest changes is electronic logging and fleet tracking. These tools help companies monitor driving hours, manage compliance, and improve operational visibility. Instead of relying on paper records, fleets can use real-time data to make faster decisions and reduce errors.

Route optimization software is another major advancement. By analyzing traffic, weather, fuel stops, and delivery windows, these systems help drivers take more efficient routes. That saves time, lowers fuel use, and improves on-time delivery performance.

Safety technology is also playing a larger role. Dash cameras, collision alerts, lane assist systems, and telematics are helping companies reduce accidents and coach drivers more effectively. These tools are especially valuable for fleets that want to improve accountability and lower insurance risk.

Even maintenance is becoming smarter. Predictive maintenance systems can flag mechanical issues before they become expensive problems. This helps reduce downtime and keeps trucks on the road longer.

The trucking industry is not replacing drivers with technology. Instead, it is using technology to support drivers, improve fleet performance, and make logistics more reliable. Companies that adapt early are more likely to stay competitive in a fast-moving market.

The future of trucking will belong to businesses that combine experience with smart tools.`,
    metaTitle: 'How the Trucking Industry Is Adapting to New Technology',
    metaDescription: 'Explore how new trucking technology is changing fleet operations, safety, route planning, fuel efficiency, and logistics.',
    tags: ['trucking technology', 'fleet management software', 'logistics technology'],
    coverImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    title: 'Best Fuel-Saving Tips for Truck Drivers and Fleet Owners',
    category: 'freight',
    author: 'Truck King Hub',
    excerpt: 'Learn fuel-saving tips for truck drivers and fleet owners to reduce costs, improve efficiency, and boost profits.',
    body: `Fuel is one of the largest expenses in trucking, which is why fuel efficiency matters for both drivers and fleet owners. Even small improvements can lead to major savings over time.

One of the best ways to save fuel is by driving smoothly. Rapid acceleration, hard braking, and aggressive speeding all increase fuel consumption. Maintaining a steady speed and using cruise control when appropriate can make a big difference on long trips.

Proper tire maintenance also plays a major role. Underinflated tires increase rolling resistance, forcing the truck to use more fuel. Regular tire checks and alignment inspections help the truck run more efficiently and safely.

Reducing idle time is another simple but powerful strategy. Idling burns fuel without moving freight, so drivers and fleets should limit unnecessary engine running whenever possible.

Route planning helps too. The shortest route is not always the most efficient route. Avoiding traffic congestion, steep grades, and weather delays can improve fuel economy and reduce stress on the vehicle.

Weight management matters as well. Carrying unnecessary cargo or equipment increases the amount of fuel required to move the truck. Fleet owners should also review load planning to make sure each trip is as efficient as possible.

Finally, driver training can produce long-term savings. When drivers understand how their habits affect fuel use, they are more likely to adopt efficient driving practices.

In a high-cost industry, fuel savings are not just about cutting expenses. They are about building a stronger, more profitable trucking operation.`,
    metaTitle: 'Best Fuel-Saving Tips for Truck Drivers and Fleet Owners',
    metaDescription: 'Learn fuel-saving tips for truck drivers and fleet owners to reduce costs, improve efficiency, and boost profits.',
    tags: ['fuel saving tips', 'trucking fuel efficiency', 'fleet fuel management'],
    coverImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    title: 'What to Know About DOT Regulations and Compliance',
    category: 'compliance',
    author: 'Truck King Hub',
    excerpt: 'Learn the basics of DOT regulations, compliance requirements, safety rules, and what truck drivers and fleets need to know.',
    body: `DOT regulations are a major part of life in the trucking industry. Whether you are a new driver or an experienced fleet owner, understanding compliance is essential for safety, legal operation, and business success.

The Department of Transportation sets rules that affect commercial drivers, vehicles, maintenance, inspections, hours of service, and recordkeeping. These rules are designed to improve safety on the road and keep trucking operations accountable.

One of the most important areas is Hours of Service. These rules limit how long drivers can operate without taking required breaks and rest periods. The goal is to prevent fatigue-related accidents and keep drivers alert.

Vehicle inspections are another critical requirement. Trucks must be properly maintained and inspected regularly to ensure they are safe for operation. Brake systems, tires, lights, and steering components are just a few of the areas that need attention.

Drivers and fleet managers also need to keep accurate records. Missing documentation can lead to penalties, delays, or audit issues. That includes logs, inspection reports, licensing documents, and maintenance records.

Compliance is not just about avoiding fines. It is about protecting drivers, cargo, and the reputation of the business. Companies that take compliance seriously are usually better organized and more trustworthy to shippers and customers.

For anyone in trucking, staying informed about DOT rules is not optional. It is a core part of running a safe and professional operation.`,
    metaTitle: 'What to Know About DOT Regulations and Compliance',
    metaDescription: 'Learn the basics of DOT regulations, compliance requirements, safety rules, and what truck drivers and fleets need to know.',
    tags: ['DOT compliance', 'trucking regulations', 'hours of service rules'],
    coverImage: 'https://images.unsplash.com/photo-1504222490345-c075b7b1b5fa?w=1200&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    title: 'The Future of Electric Trucks in the Logistics Industry',
    category: 'equipment',
    author: 'Truck King Hub',
    excerpt: 'Explore the future of electric trucks, including benefits, challenges, charging infrastructure, and logistics industry impact.',
    body: `Electric trucks are beginning to reshape conversations in the logistics industry. While diesel trucks still dominate the market, electric commercial vehicles are gaining attention because of their potential to reduce emissions, lower fuel dependency, and support more sustainable freight operations.

One of the biggest advantages of electric trucks is lower fuel and maintenance cost in some use cases. Because electric drivetrains have fewer moving parts than traditional engines, they may reduce certain maintenance needs over time. For short-haul and urban delivery routes, this can make electric trucks especially attractive.

However, the industry still faces major challenges. Charging infrastructure is not yet widespread enough to support every type of long-haul operation. Range limitations, battery weight, charging time, and high upfront vehicle cost remain major barriers for many fleets.

That said, the future looks promising. As battery technology improves and charging networks expand, more trucking companies are likely to test electric vehicles in specific routes and operations. Fleets that begin planning now will be better prepared for the shift.

Electric trucks are also tied to customer expectations and regulatory pressure. Many businesses are looking for greener supply chains, and transportation providers that adopt cleaner technology may gain a competitive advantage.

The trucking industry is unlikely to go fully electric overnight, but the transition has already started. The most practical approach is to watch developments closely and evaluate electric trucks based on route type, budget, and operational needs.`,
    metaTitle: 'The Future of Electric Trucks in the Logistics Industry',
    metaDescription: 'Explore the future of electric trucks, including benefits, challenges, charging infrastructure, and logistics industry impact.',
    tags: ['electric trucks', 'future of trucking', 'logistics sustainability'],
    coverImage: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=1200&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    title: 'How Truck Drivers Can Improve Their Health on the Road',
    category: 'lifestyle',
    author: 'Truck King Hub',
    excerpt: 'Discover health tips for truck drivers, including exercise, nutrition, sleep, hydration, and reducing road fatigue.',
    body: `Truck drivers often face serious health challenges because of long hours, limited food options, and irregular sleep schedules. Still, there are practical ways to stay healthier on the road and build better habits over time.

Nutrition is one of the most important starting points. Fast food and convenience snacks are easy to grab, but they can leave drivers feeling sluggish. Choosing protein, fruit, vegetables, and balanced meals helps maintain energy and focus throughout the day.

Hydration is equally important. Many drivers do not drink enough water, especially on long routes. Staying hydrated supports alertness, digestion, and overall physical performance.

Movement also matters. Sitting for long periods can cause stiffness, back pain, and poor circulation. Short walks, stretching, and simple exercises during breaks can improve mobility and reduce fatigue.

Sleep is another major factor. A consistent sleep schedule, even when it is not perfect, can help drivers feel more rested and alert. Quality rest supports safer decision-making and better mood on the road.

Truck drivers should also pay attention to mental health. Isolation, stress, and pressure can build up during long hauls. Calling family, listening to music, and taking time to reset during breaks can make a real difference.

A healthier trucking lifestyle is not about perfection. It is about making better choices consistently. Small improvements in food, sleep, hydration, and movement can create a better long-term quality of life.`,
    metaTitle: 'How Truck Drivers Can Improve Their Health on the Road',
    metaDescription: 'Discover health tips for truck drivers, including exercise, nutrition, sleep, hydration, and reducing road fatigue.',
    tags: ['truck driver health', 'healthy truck driver', 'trucking nutrition'],
    coverImage: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1200&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    title: 'Best Truck Stop Essentials Every Driver Should Carry',
    category: 'lifestyle',
    author: 'Truck King Hub',
    excerpt: 'See the must-have truck stop essentials every driver should carry for comfort, safety, and convenience on the road.',
    body: `A good truck stop can make a long trip easier, but every driver should still carry essential items to stay comfortable, organized, and prepared. Having the right supplies helps reduce stress and makes daily life on the road more manageable.

One of the most important essentials is a well-stocked hygiene kit. This should include items like wipes, soap, a towel, deodorant, toothpaste, and a change of clothes. Staying clean and refreshed helps drivers feel more alert and professional.

Snacks and drinks are also important. Healthy shelf-stable foods like nuts, protein bars, fruit cups, and bottled water can help drivers avoid poor eating choices when healthy food is not available.

A phone charger, power bank, and headset are must-haves for communication and navigation. Since many drivers depend on phones for dispatch, maps, and calls, keeping devices charged is critical.

Safety items belong on every trucker's checklist too. Flashlights, reflective gear, gloves, a first-aid kit, and basic tools can be useful in emergencies or breakdown situations.

Comfort items should not be overlooked. Blankets, pillows, and extra socks can improve rest and make downtime more comfortable.

Truck stop essentials are about preparation. The better prepared a driver is, the easier it becomes to handle long days, unexpected delays, and changing conditions on the road.`,
    metaTitle: 'Best Truck Stop Essentials Every Driver Should Carry',
    metaDescription: 'See the must-have truck stop essentials every driver should carry for comfort, safety, and convenience on the road.',
    tags: ['truck stop essentials', 'truck driver must haves', 'trucking gear'],
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    title: 'How to Maintain Your Truck for Long-Term Performance',
    category: 'equipment',
    author: 'Truck King Hub',
    excerpt: 'Learn how to maintain your truck for long-term performance, lower repair costs, and better safety on the road.',
    body: `Truck maintenance is one of the smartest investments a driver or fleet owner can make. A well-maintained truck lasts longer, performs better, and reduces the chance of expensive breakdowns.

The first step in long-term truck performance is regular inspection. Checking tires, brakes, lights, fluids, belts, hoses, and engine condition helps catch small problems before they become major repairs. Daily pre-trip and post-trip inspections are critical habits for every driver.

Oil changes and fluid checks are also essential. Engine oil, coolant, transmission fluid, and brake fluid all play a role in keeping the truck running safely and efficiently. Neglecting these basics can lead to serious mechanical issues.

Tire care is another major factor. Tires should be properly inflated, rotated, and inspected for wear or damage. Poor tire maintenance affects fuel economy, handling, and safety.

Drivers should also listen to the truck. Strange noises, warning lights, vibrations, or changes in performance usually mean something needs attention. Ignoring early warning signs often leads to bigger repair bills later.

Preventive maintenance is far more cost-effective than emergency repairs. That means planning service intervals, keeping records, and taking maintenance seriously before problems happen.

Long-term performance depends on consistency. Trucks that are cared for properly not only last longer, but also provide safer and more profitable service over time.`,
    metaTitle: 'How to Maintain Your Truck for Long-Term Performance',
    metaDescription: 'Learn how to maintain your truck for long-term performance, lower repair costs, and better safety on the road.',
    tags: ['truck maintenance', 'long-term truck performance', 'commercial truck care'],
    coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format&fit=crop',
    featured: false,
  },
];

async function seed() {
  console.log('Seeding 10 articles...');
  const now = new Date();

  for (let i = 0; i < ARTICLES.length; i++) {
    const a = ARTICLES[i];
    const slug = slugify(a.title);
    // Stagger published dates so they appear in order
    const publishedAt = new Date(now.getTime() - (ARTICLES.length - i) * 60 * 60 * 1000);
    const contentType =
      a.category === 'news' ? 'news' :
      a.category === 'equipment' ? 'review' :
      a.category === 'compliance' ? 'article' :
      a.category === 'freight' ? 'article' :
      a.category === 'insurance' ? 'article' :
      a.category === 'lifestyle' ? 'blog' :
      'blog';

    await sql`
      INSERT INTO articles (title, slug, author, content_type, category, excerpt, body, cover_image, meta_title, meta_description, tags, featured, status, published_at)
      VALUES (
        ${a.title}, ${slug}, ${a.author}, ${contentType}, ${a.category},
        ${a.excerpt}, ${a.body},
        ${a.coverImage}, ${a.metaTitle}, ${a.metaDescription},
        ${a.tags}, ${a.featured}, 'published', ${publishedAt}
      )
      ON CONFLICT (slug) DO NOTHING
    `;
    console.log(`  ✓ ${a.title}`);
  }

  console.log('Done.');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });

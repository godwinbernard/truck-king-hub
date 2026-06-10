// Run with: node scripts/seed-blogs.mjs
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_G5vcpYkPz8Oh@ep-proud-paper-aqn3q7pn-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(DATABASE_URL);

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const BLOGS = [
  {
    title: 'Top 10 Trucking Insurance Companies in the USA',
    slug: 'top-10-trucking-insurance-companies-usa',
    category: 'insurance',
    author: 'Truck King Hub Editorial',
    excerpt: 'Compare the top trucking insurance companies in the USA and learn what coverage matters most for owner-operators and fleet managers.',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop',
    tags: ['insurance', 'owner-operator', 'coverage', 'fleet'],
    body: `Trucking insurance is one of the most important business decisions a carrier can make. A truck is not just a vehicle. It is a revenue-producing asset, a compliance responsibility, and often the foundation of an entire operation. That is why choosing the right insurance provider matters so much.

## Why Insurance Choice Matters

The best trucking insurance companies do more than issue a policy. They help reduce risk, support claims handling, and give operators the confidence to keep freight moving. Standard auto coverage is not enough. Trucking businesses need liability protection, physical damage coverage, cargo insurance, non-trucking liability, bobtail insurance, and often specialized endorsements for different freight types.

## Top Providers

**Progressive Commercial** is one of the most recognizable names in trucking insurance. It is especially popular with owner-operators and small fleets because of its flexible quote process and broad commercial coverage options.

**The Hartford** is another major name, known for business insurance expertise and a reputation for serving a wide range of commercial customers.

**Liberty Mutual and Travelers** both stand out for larger commercial operations that need strong underwriting and a broad risk-management approach.

**Nationwide and GEICO Commercial** are also well known among trucking businesses looking for accessible coverage options. Nationwide has a long history in commercial insurance, while GEICO Commercial appeals to operators who want a simpler purchasing experience.

**State Farm** remains a familiar name because of its agent network and brand trust.

**Sentry** is often associated with transportation-focused coverage, which makes it a strong candidate for trucking businesses that want an insurer that understands the industry.

**Berkshire Hathaway GUARD and biBERK** are also worth noting. Both are associated with business insurance solutions that can appeal to trucking companies looking for modern, streamlined ways to manage coverage.

## What to Compare Beyond Price

The best trucking insurance company is not always the cheapest one. A low monthly premium may look attractive, but if the policy leaves gaps in cargo protection or takes too long to process claims, the savings can disappear quickly.

Trucking companies should compare:
- Claims support and speed
- Policy flexibility and exclusions
- Deductible options
- The provider's understanding of your freight type

Another factor to consider is the type of freight hauled. An insurer that works well for dry van freight may not be the best fit for flatbed, hazardous materials, refrigerated freight, or oversized loads.

## Review Regularly

Trucking insurance should also be reviewed regularly. As a business expands, adds trailers, hires more drivers, or begins hauling different freight, the policy needs may change. A good insurance partner should be able to grow with the company.

The top trucking insurance companies in the USA are the ones that combine reliability, industry knowledge, responsive claims handling, and practical coverage. For carriers, that means protection that supports business continuity instead of slowing it down.`,
  },
  {
    title: 'Top 10 Truck Manufacturers in the USA',
    slug: 'top-10-truck-manufacturers-usa',
    category: 'equipment',
    author: 'Truck King Hub Editorial',
    excerpt: 'Explore the top truck manufacturers in the USA and compare the brands that dominate long-haul, vocational, and fleet trucking.',
    coverImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&q=80&auto=format&fit=crop',
    tags: ['equipment', 'trucks', 'manufacturers', 'fleet'],
    body: `Truck manufacturers shape the entire trucking industry. They determine how fleets perform on fuel, how drivers experience the road, and how businesses manage maintenance, uptime, and resale value.

## The Big Names

**Freightliner** is one of the most recognized truck manufacturers in the United States. Its Cascadia model is a staple in long-haul freight because of its aerodynamic design, fuel economy, and fleet-friendly support.

**Peterbilt and Kenworth**, both part of PACCAR, are highly respected for premium build quality and strong driver appeal. These brands are especially popular among operators who care about comfort, durability, and long-term value.

**Mack Trucks** has earned a strong reputation in vocational and heavy-duty applications — rugged performance for construction work and demanding environments.

**International Trucks** remains a major name in the U.S. commercial truck market, especially for fleets that need practical options across a variety of duty cycles.

**Western Star** is known for severe-duty and custom-configured trucks. Fleet owners and owner-operators who need a truck for specialized work often consider Western Star because of its reputation for strength and adaptability.

**Volvo Trucks North America** brings a focus on safety, innovation, and driver comfort, which makes it a serious competitor in the long-haul segment.

## Choosing the Right Manufacturer

The best truck manufacturer for a business depends on how the truck will be used:
- Long-haul carriers prioritize aerodynamics, fuel efficiency, and driver comfort
- Vocational fleets care more about torque, durability, and frame strength
- Regional carriers want a balance between cost and uptime

## Total Cost of Ownership

When comparing truck manufacturers, buyers should evaluate:
- Service network coverage
- Warranty terms and parts availability
- Telematics integration
- Safety features
- Total cost of ownership

Driver preference matters too. In many fleets, the drivers who spend the most time in the truck have opinions that are worth listening to. Comfort, seat quality, dash layout, visibility, and sleeper design all affect morale and retention.

The real question is not which truck looks best on a lot. It is which truck will be easiest to keep on the road for the next five to seven years.`,
  },
  {
    title: 'Top 10 Semi Truck Brands for Fleet Owners',
    slug: 'top-10-semi-truck-brands-fleet-owners',
    category: 'equipment',
    author: 'Truck King Hub Editorial',
    excerpt: 'Discover the top semi truck brands for fleet owners and learn which models deliver uptime, comfort, fuel efficiency, and value.',
    coverImage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80&auto=format&fit=crop',
    tags: ['equipment', 'semi-truck', 'fleet', 'brands'],
    body: `Fleet owners buy semi trucks with one goal in mind: keep freight moving profitably. The best semi truck brands deliver strong uptime, dependable parts support, good fuel economy, driver comfort, and predictable maintenance costs.

## Top Brands for Fleet Operations

**Freightliner** is often the first brand that comes to mind for fleet owners. It is especially common in over-the-road freight because it balances cost, fuel efficiency, and service availability.

**Peterbilt and Kenworth** are frequently chosen by fleets that want premium trucks with strong resale value and driver appeal. These brands are known for quality builds and a loyal following among drivers.

**Volvo Trucks** places a strong emphasis on safety and ergonomics. Fleet owners that want advanced driver-assistance features and a comfortable cab often look closely at Volvo models.

**Mack Trucks** remains a strong pick for vocational and regional work, particularly where durability and towing strength matter.

**International** offers practical fleet solutions for companies that need a broad mix of truck types.

**Western Star** is often selected for severe-duty use, built on toughness, customization, and the ability to handle demanding jobs.

## Beyond the Purchase Price

Fleet owners should think beyond the purchase price. A truck that is slightly more expensive upfront can still be the better business decision if it:
- Lowers downtime
- Reduces fuel spend
- Improves driver satisfaction

## The Case for Standardization

Many successful fleets limit the number of brands they operate so maintenance procedures stay consistent and parts inventories are easier to manage. That strategy can improve training and reduce repair complexity.

Technology is also a major differentiator. Fleet owners should evaluate telematics, diagnostics, safety systems, and service scheduling tools. Modern semi trucks can generate data that helps managers monitor performance, predict repairs, and optimize routes.

The smartest fleet buyers also evaluate data integration and service planning. Brands with strong demand in the used market can reduce replacement costs and make fleet refresh cycles easier to manage.`,
  },
  {
    title: 'Top 10 Best Trucking Companies to Work For',
    slug: 'top-10-best-trucking-companies-to-work-for',
    category: 'news',
    author: 'Truck King Hub Editorial',
    excerpt: 'Discover the best trucking companies to work for in the USA and what drivers should look for in pay, home time, and equipment.',
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80&auto=format&fit=crop',
    tags: ['careers', 'drivers', 'employment', 'fleet'],
    body: `Truck drivers do not judge a company by advertising. They judge it by miles, home time, dispatch quality, equipment condition, and whether the company treats them with respect.

## Top Carriers for Drivers

**Schneider** is often mentioned because of its broad range of driving opportunities, including regional, dedicated, and over-the-road positions.

**Roehl Transport** has a strong reputation for training, safety, and driver development.

**Prime Inc.** is known for its structured training and career paths, especially for drivers building experience.

**Crete Carrier and Shaffer Trucking** are recognized for consistency and long-term driver relationships.

**Melton Truck Lines** is often respected in the flatbed segment, where safety and securement skills matter more than in standard dry van operations.

**Old Dominion Freight Line** is a major name in less-than-truckload freight, which can offer a different lifestyle than long-haul trucking.

**J.B. Hunt** offers a variety of roles across dedicated, intermodal, and logistics operations, giving drivers more route choices.

**Knight-Swift** deserves attention because of its scale and the variety of opportunities it offers across different divisions.

## What Drivers Should Evaluate

The best trucking company to work for is not the same for every driver. Some drivers want maximum miles. Others want more home time. That is why a driver should evaluate a company based on personal goals rather than reputation alone.

Pay matters, but it is not the whole story. Health benefits, retirement options, safety culture, equipment age, dispatch support, and route predictability all affect job satisfaction.

## Red Flags and Green Flags

Company reviews can help, but drivers should look for patterns rather than one-off complaints or praise. The best employers usually have:
- A clear system and expectations
- Good communication from dispatch
- A reputation for handling problems quickly and fairly

Before taking a job, drivers should compare the company against their own priorities. If home time is the priority, a regional carrier may be a better fit than a long-haul operation. The best companies offer a clear path from training to regional work, dedicated lanes, or even owner-operator opportunities.`,
  },
  {
    title: 'Top 10 Freight Broker Companies in the USA',
    slug: 'top-10-freight-broker-companies-usa',
    category: 'freight',
    author: 'Truck King Hub Editorial',
    excerpt: 'Compare the top freight broker companies in the USA and learn which logistics partners help shippers move freight efficiently.',
    coverImage: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80&auto=format&fit=crop',
    tags: ['freight', 'brokers', 'logistics', 'shipping'],
    body: `Freight brokers are a critical part of the shipping ecosystem. They connect shippers with carriers, solve capacity problems, and help freight move efficiently across the country.

## Top Freight Brokers

**C.H. Robinson** is one of the best-known names in freight brokerage and logistics. It has a broad national footprint and deep experience across shipping categories.

**TQL** is another major player, often mentioned because of its size and visibility in the brokerage market.

**Echo Global Logistics** is highly regarded for its technology-enabled brokerage services and broad customer base.

**XPO** continues to be a major logistics name, especially in freight movement and transportation coordination.

**Landstar** is unique because it connects shippers with a large network of independent transportation capacity.

**Arrive Logistics** has built a strong reputation with modern brokerage service and a focus on responsiveness.

**J.B. Hunt Transportation Services** plays a large role in freight brokerage and intermodal operations.

**Coyote Logistics** is well known in the brokerage space for its broad reach and operational scale.

## What Makes a Good Broker

A good freight broker does more than find a truck. It manages expectations, solves exceptions, and keeps freight moving when the market gets tight. That means the best brokers are strong communicators as well as strong operators.

Technology has transformed brokerage. Modern brokers use digital tools for:
- Load tracking and pricing
- Route optimization
- Documentation management

But the best systems still rely on experienced people who understand freight patterns, capacity shifts, and customer service.

## Evaluating a Freight Broker

Shippers should evaluate freight brokers based on:
- Lane expertise and responsiveness
- Claims handling process
- Visibility tools and tech stack
- Carrier quality and payment practices

The best brokers also protect relationships on both sides of the transaction. Shippers want dependable delivery and clear pricing, while carriers want fair loads and on-time payment. A broker that balances both sides well can become a long-term logistics partner.`,
  },
  {
    title: 'Top 10 Fuel Card Companies for Truckers',
    slug: 'top-10-fuel-card-companies-truckers',
    category: 'general',
    author: 'Truck King Hub Editorial',
    excerpt: 'Discover the top fuel card companies for truckers and learn how fuel cards help control costs, track spending, and save money.',
    coverImage: 'https://images.unsplash.com/photo-1571987454543-2b3a3a4f2a5e?w=1200&q=80&auto=format&fit=crop',
    tags: ['fuel', 'fuel-cards', 'owner-operator', 'cost-control'],
    body: `Fuel is one of the largest expenses in trucking, and small savings can have a major impact over time. That is why fuel cards are so valuable.

## Top Fuel Card Providers

**WEX and its EFS network** are among the best-known fuel and fleet payment platforms in the trucking world.

**Comdata** is another major provider with deep roots in trucking payments and fuel management.

**Fuelman** is widely used by smaller fleets and business owners who want simple expense tracking and broader control over purchases.

**Voyager**, through U.S. Bank, is another familiar name in fleet payment solutions.

**Mudflap** has become popular with owner-operators because of its app-based fuel savings and straightforward user experience.

**RTS Fuel Card** is often used by carriers seeking route-based savings and fleet controls.

**Circle K Pro, 7-Eleven Fleet, and Speedway Fleet** are also important because branded fuel networks can be practical when routes regularly pass through the same travel corridors.

## Beyond the Discount at the Pump

A good fuel card is not just about discounts at the pump. It should provide real operational control:
- Set spending limits per driver or transaction
- Review transactions in real time
- Detect unusual or unauthorized spending
- Generate clear fuel cost reports

## Fuel Cards and Tax Reporting

Fuel cards can also support IFTA reporting and bookkeeping. A clear fuel record can save hours during quarterly tax filings and improve financial visibility for small operations.

## How to Choose the Right Card

When choosing a fuel card company, truckers should consider:
- Acceptance network size and route coverage
- Per-gallon savings vs. monthly fees
- Reporting and analytics tools
- Whether the card fits your regular routes

A card that works perfectly in one region may not be useful in another. Route fit is everything in trucking.

Over time, the best fuel card programs also help fleets understand fuel behavior by route, driver, and season — revealing where small operational changes could create meaningful savings.`,
  },
  {
    title: 'Top 10 Trucking Technology Companies',
    slug: 'top-10-trucking-technology-companies',
    category: 'general',
    author: 'Truck King Hub Editorial',
    excerpt: 'Explore the top trucking technology companies in the USA and learn how software improves fleet safety, efficiency, and compliance.',
    coverImage: 'https://images.unsplash.com/photo-1504222490345-c075b7b1b5fa?w=1200&q=80&auto=format&fit=crop',
    tags: ['technology', 'telematics', 'ELD', 'fleet-management'],
    body: `Trucking technology has become essential to modern fleet operations. From telematics and route planning to ELD compliance and video safety tools, the best trucking technology companies help fleets reduce costs, improve visibility, and make better decisions.

## Top Trucking Tech Companies

**Samsara** is one of the most visible names in trucking technology because of its cloud-based fleet tools, connected cameras, and operational dashboards.

**Motive** is a major player, especially for fleets focused on safety, ELD management, and vehicle visibility.

**Geotab** is widely respected for telematics and vehicle data analytics that help fleets understand performance at scale.

**Omnitracs** has long been a known name in transportation technology, especially for fleet management and routing.

**Trimble Transportation** plays a major role in logistics software, route optimization, and transportation management solutions.

**Verizon Connect** is often used for fleet tracking and asset visibility across a wide range of industries.

**Fleet Complete, Descartes Systems Group, Platform Science, and Zonar** also support different parts of the trucking workflow — from in-cab technology to telematics to logistics planning.

## Buying Technology for the Right Reason

Fleets should not buy technology because it sounds modern. They should buy it because it improves performance. That might mean:
- Fewer accidents and compliance violations
- Better routing and lower fuel use
- Faster dispatch and clearer communication
- Less manual paperwork for drivers

## Technology and Retention

Technology also helps with hiring and retention. Drivers are more likely to appreciate trucks that have reliable navigation, better safety support, and clear communication tools. Managers benefit too because data makes it easier to spot trends and fix inefficiencies.

## Implementation Matters

The most successful technology rollouts are the ones that solve one clearly defined problem first. A fleet may start with ELD compliance, then add safety cameras, then bring in maintenance analytics. That staged approach is usually easier to adopt than trying to transform everything at once.

Implementation support matters too. Software alone does not change behavior. Training, rollout planning, and manager adoption determine whether a technology purchase becomes a real operational improvement.

When technology is chosen carefully, it stops being an extra expense and starts becoming part of the operating model.`,
  },
  {
    title: 'Top 10 Truck Maintenance Companies in the USA',
    slug: 'top-10-truck-maintenance-companies-usa',
    category: 'general',
    author: 'Truck King Hub Editorial',
    excerpt: 'Explore the top truck maintenance companies in the USA and learn how fleets keep trucks running, safe, and profitable.',
    coverImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80&auto=format&fit=crop',
    tags: ['maintenance', 'fleet', 'repairs', 'uptime'],
    body: `Truck maintenance is one of the biggest factors affecting profitability in the trucking industry. A well-maintained truck saves fuel, reduces breakdowns, protects the driver, and keeps freight moving on schedule.

## Top Maintenance Providers

**Rush Truck Centers** is one of the most recognizable names in commercial truck service — known for broad dealer and maintenance support across the country.

**Love's Truck Care and TA Truck Service** are especially familiar to over-the-road drivers because of their accessibility at travel centers.

**Petro** is also a major name in service stops and maintenance support along major freight corridors.

**FleetPride** is widely known for parts and aftermarket support, making it valuable for fleets that want both repair capability and access to components.

**Penske Truck Leasing** offers maintenance programs useful for businesses focused on uptime and asset management.

**Ryder** provides similar value through fleet maintenance solutions and managed transportation support.

**Velocity Truck Centers and TruckPro** support commercial truck repairs, service, and parts across various markets.

## Why Preventive Maintenance Wins

Preventive maintenance is the key to lower long-term cost. Regular maintenance should include:
- Oil changes and fluid service
- Brake checks and adjustments
- Tire inspections and rotations
- Electrical diagnostics
- Air filter and cooling system checks

A good maintenance partner should help fleets build service routines that match mileage and duty cycle — not a one-size-fits-all approach.

## Network Coverage Matters

Fleet managers should also consider network coverage. A maintenance provider with many locations can be more valuable than a cheaper local shop if the trucks run across multiple states. Roadside support, after-hours service, and mobile repair capabilities can all matter when freight is on the line.

## The Cost of Downtime

In trucking, downtime is lost money. A truck sitting for two extra days because of a repair delay can affect delivery schedules, driver morale, and customer trust.

The best service partners also help fleets anticipate future costs. When repair history is visible, managers can budget more accurately and avoid surprises — especially important for smaller fleets where one large repair bill can affect the entire month.`,
  },
  {
    title: 'Top 10 Heavy-Duty Truck Models in America',
    slug: 'top-10-heavy-duty-truck-models-america',
    category: 'equipment',
    author: 'Truck King Hub Editorial',
    excerpt: 'Explore the top heavy-duty truck models in America and compare the trucks most valued for power, efficiency, and reliability.',
    coverImage: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=1200&q=80&auto=format&fit=crop',
    tags: ['equipment', 'heavy-duty', 'trucks', 'models'],
    body: `Heavy-duty trucks are the workhorses of American freight. They carry long-haul shipments, handle regional routes, support construction work, and power many of the most demanding jobs in transportation.

## Top Heavy-Duty Models

**Freightliner Cascadia** — one of the most common heavy-duty trucks on U.S. highways. Known for aerodynamic efficiency, advanced driver support, and fleet-friendly operating costs.

**Peterbilt 579** — a popular long-haul truck that combines premium styling with modern efficiency and strong driver appeal.

**Kenworth T680** — a strong favorite for drivers who want comfort and a strong road presence. Excellent for over-the-road operations.

**Volvo VNL** — respected for safety-focused design and driver ergonomics. Strong choice for fleets prioritizing driver wellness.

**Mack Anthem** — well known for heavy-duty performance and a bold design language that appeals to many fleet buyers.

**International LT Series** — serves fleets that want practical long-haul and regional performance with broad dealer support.

**Western Star 49X** — a standout in severe-duty and vocational work. Built to handle rough conditions and demanding job sites.

**Peterbilt 389 and Kenworth W990** — often admired by drivers who prefer a classic hooded truck with modern engineering underneath.

## Matching the Model to the Job

Choosing the right heavy-duty model starts with the type of work the truck will do:
- Long-haul rigs should be aerodynamic and fuel efficient
- Vocational trucks need strength and easy maintenance
- Regional trucks require a balance of maneuverability and comfort

## Total Cost of Ownership

The total cost of ownership matters as much as horsepower. Fuel, tires, downtime, insurance, and maintenance can have a greater impact on profitability than the original purchase price.

## Driver Comfort as a Competitive Advantage

Modern truckers spend long hours in the cab. Seating, visibility, noise levels, and sleeper design can affect productivity and retention. In a labor-constrained market, a better truck can become a hiring and retention advantage.

The best model for your operation is the one that matches your fleet's operating rhythm and can be kept on the road confidently for years.`,
  },
  {
    title: 'Top 10 Commercial Truck Insurance Providers',
    slug: 'top-10-commercial-truck-insurance-providers',
    category: 'insurance',
    author: 'Truck King Hub Editorial',
    excerpt: 'Compare the top commercial truck insurance providers and learn what coverage matters most for trucking businesses and fleets.',
    coverImage: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1200&q=80&auto=format&fit=crop',
    tags: ['insurance', 'commercial', 'coverage', 'compliance'],
    body: `Commercial truck insurance is the financial safety net that keeps a transportation business alive after an accident, cargo claim, or liability event. Because trucking has higher exposure than ordinary driving, commercial truck insurance providers need to understand the unique risks involved.

## Top Commercial Insurance Providers

**Progressive Commercial** is one of the most recognized names in the market. It has a strong presence among owner-operators and small fleets, especially those who want a streamlined quote process.

**The Hartford** is another major provider that offers broad business insurance expertise and strong commercial support.

**Travelers and Liberty Mutual** are often considered by larger operations that need more comprehensive policy structures and risk-management assistance.

**Nationwide and GEICO Commercial** are also important names in the commercial truck insurance space. Nationwide is known for its broad commercial offerings, while GEICO Commercial attracts businesses that want convenient access.

**State Farm** remains a major player because of its agent network and longstanding market presence.

**Sentry** is frequently associated with transportation coverage — relevant for trucking operations that want an insurer that understands fleets, cargo, and liability exposure.

**Berkshire Hathaway GUARD and biBERK** offer commercial insurance options that suit small and midsize businesses, with simple online quoting or more traditional commercial support.

## What "Best" Really Means

The best commercial truck insurance provider is not just the one with the lowest quote. It is the one that understands the business and can respond quickly when something goes wrong.

Critical factors to compare:
- Claims handling speed and reputation
- Policy exclusions and coverage gaps
- Cargo limits and freight type compatibility
- Deductibles and endorsement options

## Coverage by Freight Type

Commercial truck operators should compare coverage by freight type. A policy suited for dry van freight may not be enough for flatbed, reefer, or hazardous materials operations. If the company hauls across state lines, the policy should match the licensing and regulatory environment in each region.

## Plan for Growth

Risk changes over time. Fleets add trucks, upgrade equipment, hire new drivers, and change lanes. Insurance should be reviewed regularly so the coverage stays aligned with the business.

The strongest commercial truck insurer is the one that stays easy to work with before and after a loss — clear paperwork, fast communication, and coverage that actually fits the business as it grows.`,
  },
];

async function seed() {
  console.log(`Seeding ${BLOGS.length} blog articles...`);

  for (const blog of BLOGS) {
    // Check if already exists
    const existing = await sql`SELECT id FROM articles WHERE slug = ${blog.slug}`;
    if (existing.length > 0) {
      console.log(`  SKIP (exists): ${blog.slug}`);
      continue;
    }

    await sql`
      INSERT INTO articles (
        title, slug, category, author, excerpt, body,
        cover_image, tags, status,
        meta_title, meta_description, published_at, featured
      ) VALUES (
        ${blog.title},
        ${blog.slug},
        ${blog.category},
        ${blog.author},
        ${blog.excerpt},
        ${blog.body},
        ${blog.coverImage},
        ${blog.tags},
        'published',
        ${blog.title},
        ${blog.excerpt},
        NOW(),
        false
      )
    `;
    console.log(`  INSERTED: ${blog.slug}`);
  }

  console.log('Done.');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });

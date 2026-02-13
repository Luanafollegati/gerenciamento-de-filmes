import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando seed...');

   await prisma.filme.createMany({
       data: [
           {
               titulo: 'O Poderoso Chefão',
               descricao: 'A história da família mafiosa Corleone',
               duracao: 175,
               genero: 'Drama',
               nota: 9.2,
               disponivel: true,
           },
           {
               titulo: 'Interestelar',
               descricao: 'Uma missão espacial para salvar a humanidade',
               duracao: 169,
               genero: 'Ficção Científica',
               nota: 9.0,
               disponivel: true,
           },
           {
               titulo: 'Cidade de Deus',
               descricao: 'A violência e o crescimento do crime no Rio de Janeiro',
               duracao: 130,
               genero: 'Drama',
               nota: 8.8,
               disponivel: true,
           },
           {
               titulo: 'Matrix',
               descricao: 'A realidade pode não ser o que parece',
               duracao: 136,
               genero: 'Ação',
               nota: 8.7,
               disponivel: true,
           },
           {
               titulo: 'Forrest Gump',
               descricao: 'A vida é como uma caixa de chocolates',
               duracao: 142,
               genero: 'Drama',
               nota: 8.8,
               disponivel: true,
           },
           {
               titulo: 'O Senhor dos Anéis: A Sociedade do Anel',
               descricao: 'A primeira parte da jornada pela Terra Média',
               duracao: 178,
               genero: 'Fantasia',
               nota: 9.1,
               disponivel: true,
           },
           {
               titulo: 'Gladiador',
               descricao: 'Um general romano busca vingança',
               duracao: 155,
               genero: 'Ação',
               nota: 8.5,
               disponivel: true,
           },
           {
               titulo: 'Parasita',
               descricao: 'Uma crítica social cheia de reviravoltas',
               duracao: 132,
               genero: 'Suspense',
               nota: 8.6,
               disponivel: true,
           },
           {
               titulo: 'A Origem',
               descricao: 'Roubar segredos dentro dos sonhos',
               duracao: 148,
               genero: 'Ficção Científica',
               nota: 8.8,
               disponivel: true,
           },
           {
               titulo: 'Vingadores: Ultimato',
               descricao: 'O confronto final contra Thanos',
               duracao: 181,
               genero: 'Ação',
               nota: 8.4,
               disponivel: true,
           },
       ],
   });


    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

<?php

namespace App\Repository;

use App\Entity\MemberOfTheJury;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MemberOfTheJury>
 *
 * @method MemberOfTheJury|null find($id, $lockMode = null, $lockVersion = null)
 * @method MemberOfTheJury|null findOneBy(array $criteria, array $orderBy = null)
 * @method MemberOfTheJury[]    findAll()
 * @method MemberOfTheJury[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MemberOfTheJuryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MemberOfTheJury::class);
    }

    public function save(MemberOfTheJury $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(MemberOfTheJury $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    //    /**
    //     * @return MemberOfTheJury[] Returns an array of MemberOfTheJury objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?MemberOfTheJury
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}

<?php

namespace App\Repository;

use App\Entity\Competition;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Competition>
 *
 * @method Competition|null find($id, $lockMode = null, $lockVersion = null)
 * @method Competition|null findOneBy(array $criteria, array $orderBy = null)
 * @method Competition[]    findAll()
 * @method Competition[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CompetitionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Competition::class);
    }

    public function save(Competition $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Competition $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // select the 8 last pictures posted (path of file, the name of competition and the submission dat) from competition order by submission date
    public function getLastPicturesPosted(Competition $competition): array {
        return $this->createQueryBuilder('c')
            // select 8 pictures path related to file path from competition order by submission date
            ->select('f.path', 'p.submission_date', 'c.competition_name')
            ->join('c.pictures', 'p')
            ->join('p.file', 'f')
            ->where('c.id = :id')
            ->setParameter('id', $competition->getId())
            ->orderBy('p.submission_date', 'DESC')
            ->setMaxResults(8)
            ->getQuery()
            ->getResult()
        ;
    }

    // select the 8 last pictures obtained votes (path of file, the name of competition and the vote date) from competition order by vote date
    public function getLastPicturesObtainedVotes(Competition $competition): array {
        return $this->createQueryBuilder('c')
            ->select('f.path', 'c.competition_name', 'v.vote_date')
            ->join('c.pictures', 'p')
            ->join('p.file', 'f')
            ->join('p.votes', 'v')
            ->where('c.id = :id')
            ->setParameter('id', $competition->getId())
            ->orderBy('v.vote_date', 'DESC')
            ->setMaxResults(8)
            ->getQuery()
            ->getResult()
        ;
    }

    // select the pictures obtained price (path of file, the name of competition and the price won) from competition order by price won
    public function getPicturesObtainedPrice(Competition $competition): array {
        return $this->createQueryBuilder('c')
            ->select('f.path', 'c.competition_name', 'p.price_won')
            ->join('c.pictures', 'p')
            ->join('p.file', 'f')
            ->where('c.id = :id')
            ->setParameter('id', $competition->getId())
            ->orderBy('p.price_won', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function getLastCompetitionPosted() {
        return $this->createQueryBuilder('c')
            ->select('c.competition_name', 'c.creation_date')
            ->orderBy('c.creation_date', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getResult()
        ;
    }

    public function getAllUserByVotingDate(int $competitionId){
        return $this->createQueryBuilder('u')
            ->select('u', 'c.voting_start_date', 'c.id')
            ->join('u.competitions', 'c')
            ->where('c.voting_start_date >= :voting_start_date')
            ->setParameter('voting_start_date', new \DateTime())
            ->getQuery()
            ->getResult()
        ;
    }

//    /**
//     * @return competition[] Returns an array of competition objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?competition
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}

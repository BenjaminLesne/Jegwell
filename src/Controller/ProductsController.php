<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProductsController extends AbstractController
{
    /**
     * @var PropertyRepository
     */
    private $repository;
    function __construct(ProductRepository $repository, ManagerRegistry $doctrine)
    {
        $this->repository = $repository;
        $this->doctrine = $doctrine;
        $this->entityManager = $doctrine->getManager();
    }

    #[Route('/creations', name: 'app_products')]
    public function index(): Response
    {
        // add new product to database
        // $product = new Product();
        // $product
        //     ->setName('mon premier produit')
        //     ->setImage('Ma premier image')
        //     ->setPrice(3900)
        //     ->setDescription("ma premier description génial")
        //     ->setSlug('premier-produit');
        // $entityManager = $doctrine->getManager();
        // $entityManager->persist($product);
        // $entityManager->flush();

        // findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)

        $products = $this->repository->findBy([], ['created_at' => 'ASC'], 5, 0);
        dump($products);
        if (!$products) {
            throw $this->createNotFoundException(
                'No products found'
            );
        };

        // $product->setPrice(40000);

        // $this->entityManager->flush();

        return $this->render('products/index.html.twig', ['products' => $products]);
    }
}

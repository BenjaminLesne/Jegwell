<?php

namespace App\Controller;

use App\Constants\Routes;
use App\Entity\ProductSearch;
use App\Form\ProductSearchType;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProductsController extends AbstractController
{
    private $repository;

    public function __construct(ProductRepository $repository)
    {
        $this->repository = $repository;
    }

    #[Route('/creations', name: Routes::PRODUCTS)]
    public function index(Request $request): Response
    {
        $search = new ProductSearch();
        $form = $this->createForm(ProductSearchType::class, $search);
        $form->handleRequest($request);
        $products = $this->repository
                        ->findAllQuery($search)
                        ->execute();

        return $this->render('products/index.html.twig', [
            'products' => $products,
            'form' => $form->createView(),
        ]);
    }
}

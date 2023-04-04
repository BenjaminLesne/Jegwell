<?php

namespace App\Controller;

use App\Constants\Routes;
use App\Entity\Category;
use App\Entity\Option;
use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProductsController extends AbstractController
{
    #[Route('/creations', name: Routes::PRODUCTS)]
    public function index(EntityManagerInterface $entityManager): Response
    {
//         $filename = "example.txt";
//         $file = fopen($filename, "w") or die("Unable to open file!");

//         $text = "Hello, world!";
//         fwrite($file, $text);
//         fclose($file);

//         $category = new Category();
        // $option = new Option();
        // $option->setName("vert")
        // ->setPrice(2000)
        // ->setImageFile($file)
        // ->setImageName("test");
        // $product = new Product();
        // $product->setName('Bruz')
        // ->setDescription("ma description qui sert pas vraiment")
        // ->addCategory($category)
        // ->addOption($option)
        // ->setSlug('bruz');

        // $entityManager->persist($option);
        // $entityManager->persist($category);
        // $entityManager->persist($product);
        // $entityManager->flush();

        return $this->render('products/index.html.twig', [
            'controller_name' => 'ProductsController TEST',
        ]);
    }
}

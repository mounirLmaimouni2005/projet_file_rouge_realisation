<?php

require_once __DIR__ . "/../classes/JsonStorage.php";
require_once __DIR__ . "/../DAO/categoryDAO.php";
require_once __DIR__ . "/../service/categoryService.php";



header( "content-type: application/json");
try{
    $file = __DIR__ . "/../Data/data.json";
    $dao = new categoryDAO($file);
    $service = new CategoryService($dao);

    $method = $_SERVER['REQUEST_METHOD'];

    if($method == 'GET'){
        $categories = $service->getAllcategories();
        http_response_code(200);
        echo json_encode($categories);

    }elseif($method == "POST"){
        $postData = json_decode(file_get_contents("php://input"), true);
        if(!is_array($postData)){
            throw new Exception('invalid JSON data');
        }
        $nom = $postData["nom"] ?? null;
        $colour = $postData["colour"] ?? null;
        $incon = $postData["incon"]?? null;
        $category = $service->addCategory($nom,$colour,$incon);
        http_response_code(201);
        echo json_encode([
            "succes" => true,
            "message" => "category added successfully",
            "data" => $category
        ]);
    }else{
        throw new Exception("method not allowed");
    }
}catch(Exception $e){
    http_response_code(400);
    echo json_encode([
        "sucess" => false,
        "message" => $e->getMessage()
        ]);
}




















?>
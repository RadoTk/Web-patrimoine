// import React from 'react';
// import { Container, Row, Col, Button, Card } from 'react-bootstrap';

// const HomePage = () => {
//   return (
//     <Container className="py-5">
//       <Row className="mb-5">
//         <Col lg={8} className="mx-auto text-center">
//           <h1 className="display-4 mb-4">Bienvenue dans l'application de gestion de patrimoine</h1>
//           <p className="lead mb-5">
//             Avec notre application, vous pouvez facilement gérer et suivre vos possessions ainsi que votre patrimoine. Suivez la valeur de vos biens, calculez votre patrimoine actuel, et prenez des décisions financières éclairées.
//           </p>
//         </Col>
//       </Row>

//       <Row className="g-4">
//         {[
//           {
//             title: "Vue d'ensemble",
//             text: "Consultez la valeur totale de votre patrimoine, visualisez les tendances au fil du temps et obtenez des insights précieux.",
//             buttonText: "Voir Patrimoine",
//             buttonVariant: "primary",
//             href: "/patrimoine"
//           },
//           {
//             title: "Liste des Possessions",
//             text: "Gérez vos possessions, ajoutez, modifiez ou clôturez des biens facilement.",
//             buttonText: "Voir Possessions",
//             buttonVariant: "secondary",
//             href: "/possessions"
//           },
//           {
//             title: "Ajouter une Possession",
//             text: "Enregistrez de nouvelles possessions dans votre portefeuille pour une gestion complète.",
//             buttonText: "Ajouter une Possession",
//             buttonVariant: "success",
//             href: "/possessions/create"
//           }
//         ].map((card, index) => (
//           <Col key={index} md={4} className="d-flex">
//             <Card className="flex-fill shadow-sm">
//               <Card.Body className="d-flex flex-column">
//                 <Card.Title className="h4 mb-4">{card.title}</Card.Title>
//                 <Card.Text className="flex-grow-1">{card.text}</Card.Text>
//                 <Button variant={card.buttonVariant} href={card.href} className="mt-auto">
//                   {card.buttonText}
//                 </Button>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default HomePage;

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={8} className="mx-auto text-center">
          <h1 className="display-4 mb-4">Bienvenue dans l'application de gestion de patrimoine</h1>
          <p className="lead mb-5">
            Avec notre application, vous pouvez facilement gérer et suivre vos possessions ainsi que votre patrimoine. Suivez la valeur de vos biens, calculez votre patrimoine actuel, et prenez des décisions financières éclairées.
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        {[
          {
            title: "Vue d'ensemble",
            text: "Consultez la valeur totale de votre patrimoine, visualisez les tendances au fil du temps et obtenez des insights précieux.",
            buttonText: "Voir Patrimoine",
            buttonVariant: "primary",
            href: "/patrimoine"
          },
          {
            title: "Liste des Possessions",
            text: "Gérez vos possessions, ajoutez, modifiez ou clôturez des biens facilement.",
            buttonText: "Voir Possessions",
            buttonVariant: "secondary",
            href: "/possessions"
          },
          {
            title: "Ajouter une Possession",
            text: "Enregistrez de nouvelles possessions dans votre portefeuille pour une gestion complète.",
            buttonText: "Ajouter une Possession",
            buttonVariant: "success",
            href: "/possessions/create"
          }
        ].map((card, index) => (
          <Col key={index} md={4} className="d-flex">
            <Card className="flex-fill shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="h4 mb-4">{card.title}</Card.Title>
                <Card.Text className="flex-grow-1">{card.text}</Card.Text>
                <Button
                  as={Link}
                  to={card.href}
                  variant={card.buttonVariant}
                  className="mt-auto"
                >
                  {card.buttonText}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;

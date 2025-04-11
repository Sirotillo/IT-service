const getBrokenProductClients = async (req, res) => {
  const { from, to } = req.body;

  try {
    const [clients] = await sequelize.query(
      `
        SELECT DISTINCT cl.*
        FROM contracts c
        JOIN clients cl ON c.client_id = cl.id
        WHERE c.start_date <= :to
          AND c.end_date >= :from
          AND c.status = false
      `,
      {
        replacements: { from, to },
      }
    );

    res.send(clients);
  } catch (error) {
    errorHandler(error, res);
    res.status(500).json({ message: "Xatolik yuz berdi", error });
  }
};

const getCanceledClients = async (req, res) => {
  const { from, to } = req.query;

  try {
    const [clients] = await sequelize.query(
      `
        SELECT DISTINCT cl.*
        FROM contracts c
        JOIN clients cl ON c.client_id = cl.id
        WHERE c.start_date <= :to
          AND c.end_date >= :from
          AND c.status = false
      `,
      {
        replacements: { from, to },
      }
    );

    res.send(clients);
  } catch (error) {
    errorHandler(error, res);
    res.status(500).json({ message: "Xatolik yuz berdi", error });
  }
};

async function getClientPayments(clientId) {
  try {
    const result = await sequelize.query(
      `
            SELECT p.id AS product_id, p.name AS product_name, c.name AS category_name, o.name AS owner_name, pay.amount AS payment_amount, pay.date AS payment_date
            FROM Clients cl
            JOIN Rentals r ON cl.id = r.client_id
            JOIN Products p ON r.product_id = p.id
            JOIN Categories c ON p.category_id = c.id
            JOIN Owners o ON p.owner_id = o.id
            JOIN Payments pay ON r.id = pay.rental_id
            WHERE cl.id = :clientId
            ORDER BY pay.date DESC;
        `,
      {
        replacements: { clientId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log(result);
  } catch (error) {
    errorHandler(error, res);
    console.error("Xatolik:", error);
  }
}

async function getTopRentingOwners() {
  try {
    const result = await sequelize.query(
      `
            SELECT o.id, o.name, COUNT(r.id) AS rental_count
            FROM Owners o
            JOIN Products p ON o.id = p.owner_id
            JOIN Rentals r ON p.id = r.product_id
            WHERE r.status = 'rented'
            GROUP BY o.id
            ORDER BY rental_count DESC
            LIMIT 10;
        `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log(result);
  } catch (error) {
    errorHandler(error, res);
    console.error("Xatolik:", error);
  }
}

const getRentedProductsInRange = async (req, res) => {
  const { from, to } = req.query;

  try {
    const [results] = await sequelize.query(
      `
        SELECT * FROM rentals
        WHERE start_date <= :to AND end_date >= :from
      `,
      {
        replacements: { from, to },
      }
    );

    res.send(results);
  } catch (error) {
    errorHandler(error, res);
    res.status(500).json({ message: "Xatolik yuz berdi" });
  }
};

module.exports = {
  getBrokenProductClients,
  getCanceledClients,
  getClientPayments,
  getTopRentingOwners,
  getRentedProductsInRange,
};

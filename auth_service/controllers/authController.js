const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    try {
        const user = await User.findOne({ where: { email }, include: 'Role' });
        if (!user) {
            console.log('Login failed: User not found for email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('User found:', user.email, 'Role:', user.Role ? user.Role.name : 'No Role');
        // console.log('Stored Hash:', user.password); // Careful with logs

        const valid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', valid);

        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.Role.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, role: user.Role.name },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { login };

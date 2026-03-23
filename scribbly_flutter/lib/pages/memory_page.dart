import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:async';
import 'dart:math';

class MemoryPage extends StatefulWidget {
  const MemoryPage({super.key});

  @override
  State<MemoryPage> createState() => _MemoryPageState();
}

class _MemoryPageState extends State<MemoryPage> {
  String _activeGame = ''; // 'sequence', 'match'
  String _gameState = 'menu'; // 'menu', 'playing', 'feedback'
  
  // Sequence Game State
  List<int> _sequence = [];
  List<int> _userSequence = [];
  int? _activeButton;
  int _score = 0;

  // Match Game State
  List<Map<String, dynamic>> _cards = [];
  List<int> _flipped = [];
  List<int> _matched = [];

  final List<Map<String, dynamic>> _sequenceColors = [
    {'id': 1, 'c': const Color(0xFF38BDF8)},
    {'id': 2, 'c': const Color(0xFF4ADE80)},
    {'id': 3, 'c': const Color(0xFFFACC15)},
    {'id': 4, 'c': const Color(0xFFFB7185)},
  ];

  final List<String> _matchIcons = ['🍎', '🚀', '🌈', '🧩', '🎸', '🍦'];

  // --- Sequence Game Logic ---
  void _startSequence() {
    setState(() {
      _score = 0;
      _gameState = 'playing';
      _sequence = [Random().nextInt(4) + 1];
      _userSequence = [];
    });
    _playSequence(_sequence);
  }

  Future<void> _playSequence(List<int> seq) async {
    setState(() => _activeButton = null);
    for (int id in seq) {
      await Future.delayed(const Duration(milliseconds: 600));
      if (!mounted) return;
      setState(() => _activeButton = id);
      await Future.delayed(const Duration(milliseconds: 400));
      if (!mounted) return;
      setState(() => _activeButton = null);
    }
  }

  void _handleSequenceInput(int id) {
    if (_gameState != 'playing' || _activeButton != null) return;
    
    setState(() {
      _userSequence.add(id);
    });

    if (id != _sequence[_userSequence.length - 1]) {
      setState(() => _gameState = 'feedback');
      return;
    }

    if (_userSequence.length == _sequence.length) {
      setState(() {
        _score++;
        _userSequence = [];
        _sequence.add(Random().nextInt(4) + 1);
      });
      Future.delayed(const Duration(milliseconds: 1000), () => _playSequence(_sequence));
    }
  }

  // --- Match Game Logic ---
  void _startMatch() {
    List<String> deck = [..._matchIcons, ..._matchIcons];
    deck.shuffle();
    setState(() {
      _score = 0;
      _gameState = 'playing';
      _cards = deck.asMap().entries.map((e) => {'id': e.key, 'icon': e.value}).toList();
      _matched = [];
      _flipped = [];
    });
  }

  void _handleMatchInput(int index) {
    if (_flipped.length == 2 || _matched.contains(index) || _flipped.contains(index)) return;

    setState(() {
      _flipped.add(index);
    });

    if (_flipped.length == 2) {
      int first = _flipped[0];
      int second = _flipped[1];
      if (_cards[first]['icon'] == _cards[second]['icon']) {
        setState(() {
          _matched.addAll([first, second]);
          _flipped = [];
          _score++;
        });
        if (_matched.length == _cards.length) {
          setState(() => _gameState = 'feedback');
        }
      } else {
        Future.delayed(const Duration(milliseconds: 1000), () {
          if (mounted) setState(() => _flipped = []);
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 768;

    return Container(
      padding: const EdgeInsets.all(24),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (isDesktop) ...[
            Expanded(flex: 1, child: _buildSidebar()),
            const SizedBox(width: 24),
          ],
          Expanded(flex: 3, child: _buildMainArea()),
        ],
      ),
    );
  }

  Widget _buildSidebar() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Brain Coach 🧠', style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 8),
          Text('Choose a focus area to sharpen your skills.', style: GoogleFonts.plusJakartaSans(fontSize: 14, color: Colors.white60)),
          const SizedBox(height: 32),
          _buildMenuButton('🔢 Sequential Memory', _activeGame == 'sequence', () {
            setState(() { _activeGame = 'sequence'; _gameState = 'menu'; });
          }),
          const SizedBox(height: 12),
          _buildMenuButton('🧩 Visual Matching', _activeGame == 'match', () {
            setState(() { _activeGame = 'match'; _gameState = 'menu'; });
          }),
          const Spacer(),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF38BDF8).withOpacity(0.05),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF38BDF8).withOpacity(0.2)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('SESSION BEST', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w800, color: const Color(0xFF38BDF8))),
                Text('$_score', style: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuButton(String label, bool isSelected, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF38BDF8) : Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            color: isSelected ? const Color(0xFF0F172A) : Colors.white,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildMainArea() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white10),
      ),
      child: Center(
        child: _gameState == 'menu' ? _buildMenu() : (_gameState == 'playing' ? _buildGame() : _buildFeedback()),
      ),
    );
  }

  Widget _buildMenu() {
    if (_activeGame.isEmpty) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text('🧠', style: TextStyle(fontSize: 64)),
          const SizedBox(height: 16),
          Text('Select a Game', style: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.w900, color: Colors.white)),
          const SizedBox(height: 8),
          Text('Choose a focus area from the sidebar to begin.', style: GoogleFonts.plusJakartaSans(color: Colors.white60)),
        ],
      );
    }
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(_activeGame == 'sequence' ? '🔢' : '🧩', style: const TextStyle(fontSize: 64)),
        const SizedBox(height: 16),
        Text(_activeGame == 'sequence' ? 'Color Sequence' : 'Visual Match', style: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.w900, color: Colors.white)),
        const SizedBox(height: 8),
        Text(_activeGame == 'sequence' ? 'Watch the sequence and repeat it.' : 'Find all the hidden pairs in the grid.', style: GoogleFonts.plusJakartaSans(color: Colors.white60)),
        const SizedBox(height: 32),
        ElevatedButton(
          onPressed: _activeGame == 'sequence' ? _startSequence : _startMatch,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF38BDF8),
            foregroundColor: const Color(0xFF0F172A),
            padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 20),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          child: const Text('Start Game', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        ),
      ],
    );
  }

  Widget _buildGame() {
    if (_activeGame == 'sequence') {
      return GridView.count(
        shrinkWrap: true,
        crossAxisCount: 2,
        mainAxisSpacing: 24,
        crossAxisSpacing: 24,
        padding: const EdgeInsets.all(48),
        children: _sequenceColors.map((col) {
          bool isActive = _activeButton == col['id'];
          return GestureDetector(
            onTap: () => _handleSequenceInput(col['id']),
            child: AnimatedScale(
              scale: isActive ? 1.05 : 1.0,
              duration: const Duration(milliseconds: 150),
              child: Container(
                decoration: BoxDecoration(
                  color: isActive ? col['c'] : Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(32),
                  border: Border.all(color: (col['c'] as Color).withOpacity(0.2), width: 4),
                  boxShadow: isActive ? [BoxShadow(color: (col['c'] as Color).withOpacity(0.5), blurRadius: 20)] : [],
                ),
              ),
            ),
          );
        }).toList(),
      );
    } else {
      return GridView.builder(
        shrinkWrap: true,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4,
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
        ),
        padding: const EdgeInsets.all(32),
        itemCount: _cards.length,
        itemBuilder: (context, index) {
          bool isVisible = _flipped.contains(index) || _matched.contains(index);
          return GestureDetector(
            onTap: () => _handleMatchInput(index),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              decoration: BoxDecoration(
                color: isVisible ? const Color(0xFF38BDF8) : Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(16),
              ),
              alignment: Alignment.center,
              child: Text(
                isVisible ? _cards[index]['icon'] : '❓',
                style: const TextStyle(fontSize: 32),
              ),
            ),
          );
        },
      );
    }
  }

  Widget _buildFeedback() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Text('🏆', style: TextStyle(fontSize: 64)),
        const SizedBox(height: 16),
        Text('Finished!', style: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.w900, color: Colors.white)),
        const SizedBox(height: 8),
        Text('You performed brilliantly. Keep training!', style: GoogleFonts.plusJakartaSans(color: Colors.white60)),
        const SizedBox(height: 32),
        TextButton(
          onPressed: () => setState(() => _gameState = 'menu'),
          child: const Text('Back to Menu', style: TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.bold, fontSize: 16)),
        ),
      ],
    );
  }
}

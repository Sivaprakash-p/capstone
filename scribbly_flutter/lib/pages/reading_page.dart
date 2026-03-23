import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_tts/flutter_tts.dart';

class ReadingPage extends StatefulWidget {
  const ReadingPage({super.key});

  @override
  State<ReadingPage> createState() => _ReadingPageState();
}

class _ReadingPageState extends State<ReadingPage> {
  final FlutterTts flutterTts = FlutterTts();
  
  final List<Map<String, String>> _stories = [
    {
      'title': 'The Little Seed 🌱',
      'text': 'A tiny seed fell into the soft brown earth. Rain came and the sun shone bright. Slowly a small green shoot pushed up through the soil. Day by day it grew taller and stronger. One morning a beautiful flower opened wide and smiled at the sky.'
    },
    {
      'title': 'Max the Dog 🐕',
      'text': 'Max was a small dog with a very big heart. One rainy day he found a lost kitten shivering under a bench. The kitten was cold and scared and alone. Max sat close beside it and kept it warm all night long. In the morning the kitten\'s family came running with joy.'
    },
    {
      'title': 'Stars at Night ✨',
      'text': 'Every night the stars come out to play high above us. They twinkle and sparkle in patterns called constellations. Long ago sailors used these star patterns to find their way safely across dark oceans. You can find a big bear and a little bear up in the sky tonight.'
    },
  ];

  int _selectedStoryIndex = 0;
  int _highlightedWordIndex = -1;
  bool _isPlaying = false;
  double _speed = 1.0;
  bool _isCustom = false;
  final TextEditingController _customTextController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _initTts();
  }

  void _initTts() {
    flutterTts.setStartHandler(() {
      setState(() => _isPlaying = true);
    });

    flutterTts.setCompletionHandler(() {
      setState(() {
        _isPlaying = false;
        _highlightedWordIndex = -1;
      });
    });

    flutterTts.setProgressHandler((String text, int start, int end, String word) {
      // Logic for word highlighting could be improved with more precise progress tracking
    });
  }

  List<String> get _words {
    String text = _isCustom ? _customTextController.text : _stories[_selectedStoryIndex]['text']!;
    return text.split(RegExp(r'\s+')).where((w) => w.isNotEmpty).toList();
  }

  Future<void> _speak(String text) async {
    await flutterTts.setSpeechRate(_speed * 0.5); // Flutter TTS speed is often faster than web
    await flutterTts.speak(text);
  }

  Future<void> _stop() async {
    await flutterTts.stop();
    setState(() {
      _isPlaying = false;
      _highlightedWordIndex = -1;
    });
  }

  void _togglePlay() {
    if (_isPlaying) {
      _stop();
    } else {
      _speak(_isCustom ? _customTextController.text : _stories[_selectedStoryIndex]['text']!);
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
            Expanded(
              flex: 1,
              child: _buildSidebar(),
            ),
            const SizedBox(width: 24),
          ],
          Expanded(
            flex: 3,
            child: _buildMainContent(),
          ),
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
          Text(
            'Library 📖',
            style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w800, color: Colors.white),
          ),
          const SizedBox(height: 8),
          Text(
            'Choose a story to practice your reading skills.',
            style: GoogleFonts.plusJakartaSans(fontSize: 14, color: Colors.white60),
          ),
          const SizedBox(height: 32),
          ...List.generate(_stories.length, (index) {
            bool isSelected = !_isCustom && _selectedStoryIndex == index;
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _buildMenuButton(
                _stories[index]['title']!,
                isSelected,
                () => setState(() {
                  _selectedStoryIndex = index;
                  _isCustom = false;
                  _stop();
                }),
              ),
            );
          }),
          _buildMenuButton(
            '✏️ My Own Text',
            _isCustom,
            () => setState(() {
              _isCustom = true;
              _stop();
            }),
          ),
          if (_isCustom) ...[
            const SizedBox(height: 16),
            TextField(
              controller: _customTextController,
              maxLines: 5,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Paste your text here...',
                hintStyle: const TextStyle(color: Colors.white38),
                filled: true,
                fillColor: Colors.white.withOpacity(0.05),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Colors.white10),
                ),
              ),
            ),
          ],
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

  Widget _buildMainContent() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        children: [
          Expanded(
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.02),
                borderRadius: BorderRadius.circular(16),
              ),
              child: SingleChildScrollView(
                child: Wrap(
                  spacing: 6,
                  runSpacing: 8,
                  children: _words.asMap().entries.map((entry) {
                    int idx = entry.key;
                    String word = entry.value;
                    bool isHighlighted = _highlightedWordIndex == idx;
                    return GestureDetector(
                      onTap: () async {
                        setState(() => _highlightedWordIndex = idx);
                        await _speak(word);
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                        decoration: BoxDecoration(
                          color: isHighlighted ? const Color(0xFF38BDF8) : Colors.transparent,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          word,
                          style: GoogleFonts.lexend(
                            fontSize: 22,
                            height: 1.8,
                            color: isHighlighted ? const Color(0xFF0F172A) : Colors.white,
                            fontWeight: isHighlighted ? FontWeight.w700 : FontWeight.w400,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          _buildControls(),
        ],
      ),
    );
  }

  Widget _buildControls() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          ElevatedButton(
            onPressed: _togglePlay,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF38BDF8),
              foregroundColor: const Color(0xFF0F172A),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: Text(
              _isPlaying ? '⏸ Stop Narration' : '▶️ Listen to Story',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(width: 32),
          Text(
            'SPEED',
            style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white38),
          ),
          const SizedBox(width: 16),
          ...[0.8, 1.0, 1.25].map((s) => Padding(
            padding: const EdgeInsets.only(right: 8),
            child: InkWell(
              onTap: () => setState(() => _speed = s),
              child: Container(
                width: 40,
                height: 40,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _speed == s ? const Color(0xFF38BDF8) : Colors.white10,
                ),
                child: Text(
                  '${s}x',
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: _speed == s ? const Color(0xFF0F172A) : Colors.white,
                  ),
                ),
              ),
            ),
          )),
        ],
      ),
    );
  }
}

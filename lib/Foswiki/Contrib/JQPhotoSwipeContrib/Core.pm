# Extension for Foswiki - The Free and Open Source Wiki, http://foswiki.org/
#
# JQPhotoSwipeContrib is Copyright (C) 2016-2019 Michael Daum http://michaeldaumconsulting.com
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details, published at
# http://www.gnu.org/copyleft/gpl.html

package Foswiki::Contrib::JQPhotoSwipeContrib::Core;

use strict;
use warnings;

use Foswiki::Func ();
use Foswiki::Plugins::JQueryPlugin::Plugin ();
our @ISA = qw( Foswiki::Plugins::JQueryPlugin::Plugin );

use constant TRACE => 0; # toggle me

sub writeDebug {
  return unless TRACE;
  #Foswiki::Func::writeDebug("JQPhotoSwipeContrib::Core - $_[0]");
  print STDERR "JQPhotoSwipeContrib::Core - $_[0]\n";
}

sub new {
  my $class = shift;

  my $this = bless(
    $class->SUPER::new(
      name => 'PhotoSwipe',
      version => '4.1.2',
      author => 'Dmitry Semenov',
      homepage => 'http://photoswipe.com',
      css => ['pkg.css'],
      javascript => ['pkg.js'],
      puburl => '%PUBURLPATH%/%SYSTEMWEB%/JQPhotoSwipeContrib',
    ),
    $class
  );

  $this->{_doneReadTemplate} = 0;
  return $this;
}

sub init {
    my $this = shift;

    return unless $this->SUPER::init();

    unless ($this->{_doneReadTemplate}) {
      $this->{_doneReadTemplate} = 1;
      Foswiki::Func::readTemplate("photoswipe");
    }
    my $tmpl = Foswiki::Func::expandTemplate("pswp");

    Foswiki::Func::addToZone("body", "JQUERYPLUGIN::JQPHOTOSWIPECONTRIB::PSWP", $tmpl);
}

1;
